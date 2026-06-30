import { NavLink, Outlet } from "react-router-dom";
import { Info, ShieldCheck } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { Navigation } from "./Navigation";
import { useProjectMetaStore } from "../../state/projectMetaStore";
import { ProjectManager } from "../ProjectManager";
import { ProjectPersistenceProvider } from "../ProjectPersistenceProvider";
import sugangcheckIcon from "../../assets/sugangcheck-icon.png";

export function AppLayout() {
  const { projectName } = useProjectMetaStore();

  return (
    <div className="app-shell">
      <ProjectPersistenceProvider />
      <aside className="sidebar" aria-label="주 메뉴">
        <div className="brand">
          <img className="brand__icon" src={sugangcheckIcon} alt="" aria-hidden="true" />
          <div className="brand__text">
            <p className="brand__title">수강신청 오류 점검</p>
          </div>
        </div>
        <Navigation />
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "sidebar__credit-button sidebar__credit-button--active"
              : "sidebar__credit-button"
          }
        >
          <Info size={16} aria-hidden="true" />
          <span>
            부산광역시교육청 시간표지원단
            <br />
            교사 권보성
          </span>
        </NavLink>
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
