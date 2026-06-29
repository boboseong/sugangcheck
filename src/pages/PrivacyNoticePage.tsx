import { ClearLocalDataButton } from "../components/ClearLocalDataButton";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { checkNoRemoteUpload } from "../utils/checkNoRemoteUpload";

export function PrivacyNoticePage() {
  const remoteUploadCheck = checkNoRemoteUpload();

  return (
    <section className="page">
      <PageHeader
        title="개인정보 처리 원칙"
        description="학생 개인정보와 원본 엑셀 파일은 원격 서버로 업로드하지 않고 브라우저 로컬에서만 처리합니다."
      />
      <div className="dashboard-grid">
        <article className="card">
          <StatusBadge tone="ready">서버 업로드 없음</StatusBadge>
          <h2>정적 프론트엔드</h2>
          <p>개발 서버는 앱 자산 제공에만 쓰며, 학생 데이터 처리는 브라우저 안에서 끝납니다.</p>
        </article>
        <article className="card">
          <StatusBadge tone="ready">원본 파일 제외</StatusBadge>
          <h2>IndexedDB 저장</h2>
          <p>구조화된 프로젝트 상태만 저장하고 원본 엑셀 바이너리는 저장하지 않습니다.</p>
        </article>
        <article className="card">
          <StatusBadge tone="warning">개인정보 포함</StatusBadge>
          <h2>프로젝트 파일</h2>
          <p>내보내기 전 개인정보 포함 경고를 표시하는 흐름으로 구현합니다.</p>
        </article>
      </div>
      <section className="section">
        <h2>보호 기능 점검</h2>
        <table className="placeholder-table">
          <tbody>
            <tr>
              <th>원격 업로드 설정</th>
              <td>
                <StatusBadge
                  tone={remoteUploadCheck.remoteUploadConfigured ? "error" : "ready"}
                >
                  {remoteUploadCheck.remoteUploadConfigured ? "설정 발견" : "없음"}
                </StatusBadge>
              </td>
            </tr>
            <tr>
              <th>점검 키</th>
              <td>{remoteUploadCheck.checkedKeys.join(", ")}</td>
            </tr>
            <tr>
              <th>작업 데이터 삭제</th>
              <td>
                <ClearLocalDataButton />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  );
}
