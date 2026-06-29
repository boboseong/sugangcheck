import { Outlet } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { Navigation } from "./Navigation";
import { useProjectMetaStore } from "../../state/projectMetaStore";
import { ProjectManager } from "../ProjectManager";
import { ProjectPersistenceProvider } from "../ProjectPersistenceProvider";

export function AppLayout() {
  const { projectName } = useProjectMetaStore();

  return (
    <div className="app-shell">
      <ProjectPersistenceProvider />
      <aside className="sidebar" aria-label="주 메뉴">
        <div className="brand">
          <p className="brand__title">수강신청 오류 검증</p>
          <p className="brand__subtitle">브라우저 로컬 전용 점검 도구</p>
        </div>
        <Navigation />
        <p className="sidebar__credit">부산광역시교육청 교사 권보성</p>
      </aside>
      <div className="shell-main">
        <header className="topbar">
          <div className="topbar__meta">
            <p className="topbar__eyebrow">현재 프로젝트</p>
            <p className="topbar__title">{projectName}</p>
          </div>
          <div className="topbar__actions" aria-label="프로젝트 상태">
            <ProjectManager />
            <IconButton label="서버 업로드 없음" icon={<ShieldCheck size={18} />} />
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
