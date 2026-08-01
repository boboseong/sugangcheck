import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Info, ShieldCheck } from "lucide-react";
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
            {/* App-level reassurance, not project state — it sat in the topbar
                as a button with no action and pushed the actions onto a third row. */}
            <span className="brand__offline-badge">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>오프라인 전용</span>
            </span>
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
            <p className="topbar__title" title={projectName}>
              {projectName}
            </p>
          </div>
          <div className="topbar__actions" aria-label="프로젝트 상태">
            <ProjectManager />
          </div>
        </header>
        <main>
          <Suspense fallback={<p className="route-loading">불러오는 중…</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
