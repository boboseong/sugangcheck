import { describe, expect, it } from "vitest";
import { sanitizeRow } from "./projectTransferWorkbook";

describe("sanitizeRow", () => {
  it("drops keys that could reach Object.prototype", () => {
    const row = JSON.parse(
      '{"field":"students","__proto__":{"polluted":"yes"},"constructor":"x","prototype":"y"}'
    ) as Record<string, unknown>;

    const safeRow = sanitizeRow(row);

    expect(Object.keys(safeRow)).toEqual(["field"]);
    expect(safeRow.field).toBe("students");
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it("keeps ordinary transfer columns and detaches the prototype chain", () => {
    const safeRow = sanitizeRow({ field: "operatingSubjects", value: "{}", index: 2 });

    expect(safeRow).toEqual(
      expect.objectContaining({ field: "operatingSubjects", value: "{}", index: 2 })
    );
    expect(Object.getPrototypeOf(safeRow)).toBeNull();
    expect("toString" in safeRow).toBe(false);
  });
});
