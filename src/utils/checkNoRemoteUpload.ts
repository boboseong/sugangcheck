export type RemoteUploadCheckResult = {
  remoteUploadConfigured: boolean;
  checkedKeys: string[];
};

export function checkNoRemoteUpload(env: Record<string, unknown> = import.meta.env): RemoteUploadCheckResult {
  const checkedKeys = ["VITE_REMOTE_UPLOAD_URL", "VITE_API_BASE_URL"];
  const remoteUploadConfigured = checkedKeys.some((key) => Boolean(env[key]));

  return { remoteUploadConfigured, checkedKeys };
}
