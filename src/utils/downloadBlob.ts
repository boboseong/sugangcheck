import { isTauri } from "@tauri-apps/api/core";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

function browserDownloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function fileExtension(fileName: string): string | undefined {
  const extension = fileName.split(".").pop()?.trim();

  return extension && extension !== fileName ? extension.toLowerCase() : undefined;
}

function saveDialogFilters(fileName: string) {
  const extension = fileExtension(fileName);

  return extension
    ? [
        {
          name: `${extension.toUpperCase()} 파일`,
          extensions: [extension]
        }
      ]
    : undefined;
}

async function saveBlobWithTauri(blob: Blob, fileName: string) {
  const path = await save({
    defaultPath: fileName,
    filters: saveDialogFilters(fileName)
  });

  if (!path) {
    return false;
  }

  await writeFile(path, new Uint8Array(await blob.arrayBuffer()));
  return true;
}

export async function downloadBlob(blob: Blob, fileName: string): Promise<boolean> {
  if (!isTauri()) {
    browserDownloadBlob(blob, fileName);
    return true;
  }

  try {
    return await saveBlobWithTauri(blob, fileName);
  } catch (error) {
    console.error("파일 저장에 실패했습니다.", error);
    window.alert("파일을 저장하지 못했습니다. 저장 위치와 권한을 확인해 주세요.");
    return false;
  }
}
