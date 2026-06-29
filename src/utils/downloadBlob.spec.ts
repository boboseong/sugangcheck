import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const tauriMocks = vi.hoisted(() => ({
  isTauri: vi.fn(),
  save: vi.fn(),
  writeFile: vi.fn()
}));

vi.mock("@tauri-apps/api/core", () => ({
  isTauri: tauriMocks.isTauri
}));

vi.mock("@tauri-apps/plugin-dialog", () => ({
  save: tauriMocks.save
}));

vi.mock("@tauri-apps/plugin-fs", () => ({
  writeFile: tauriMocks.writeFile
}));

import { downloadBlob } from "./downloadBlob";

describe("downloadBlob", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = "";
    tauriMocks.isTauri.mockReturnValue(false);
    tauriMocks.save.mockReset();
    tauriMocks.writeFile.mockReset();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:test")
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn()
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("uses the browser download fallback outside Tauri", async () => {
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    const saved = await downloadBlob(new Blob(["data"]), "file.xlsx");

    expect(saved).toBe(true);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(click).toHaveBeenCalledTimes(1);
    expect(document.querySelector("a[download='file.xlsx']")).toBeNull();

    vi.runAllTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
    expect(tauriMocks.save).not.toHaveBeenCalled();
  });

  it("writes the selected file path inside Tauri", async () => {
    tauriMocks.isTauri.mockReturnValue(true);
    tauriMocks.save.mockResolvedValue("C:\\Downloads\\file.xlsx");
    tauriMocks.writeFile.mockResolvedValue(undefined);

    const saved = await downloadBlob(
      new Blob([new Uint8Array([1, 2, 3])]),
      "file.xlsx"
    );

    expect(saved).toBe(true);
    expect(tauriMocks.save).toHaveBeenCalledWith({
      defaultPath: "file.xlsx",
      filters: [{ name: "XLSX 파일", extensions: ["xlsx"] }]
    });
    expect(tauriMocks.writeFile).toHaveBeenCalledTimes(1);
    expect(tauriMocks.writeFile.mock.calls[0]?.[0]).toBe(
      "C:\\Downloads\\file.xlsx"
    );
    expect(Array.from(tauriMocks.writeFile.mock.calls[0]?.[1] as Uint8Array)).toEqual([
      1,
      2,
      3
    ]);
  });

  it("does not write a file when the Tauri save dialog is cancelled", async () => {
    tauriMocks.isTauri.mockReturnValue(true);
    tauriMocks.save.mockResolvedValue(null);

    const saved = await downloadBlob(new Blob(["data"]), "file.xlsx");

    expect(saved).toBe(false);
    expect(tauriMocks.writeFile).not.toHaveBeenCalled();
  });

  it("returns false when Tauri file writing fails", async () => {
    const alert = vi.spyOn(window, "alert").mockImplementation(() => undefined);
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    tauriMocks.isTauri.mockReturnValue(true);
    tauriMocks.save.mockResolvedValue("C:\\Downloads\\file.xlsx");
    tauriMocks.writeFile.mockRejectedValue(new Error("denied"));

    const saved = await downloadBlob(new Blob(["data"]), "file.xlsx");

    expect(saved).toBe(false);
    expect(alert).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      "파일 저장에 실패했습니다.",
      expect.any(Error)
    );
  });
});
