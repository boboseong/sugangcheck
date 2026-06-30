import {
  ClipboardCheck,
  FileSpreadsheet,
  Home,
  ListChecks,
  Settings,
  Upload,
  Users,
  UserRoundPlus,
  Wrench
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "대시보드", icon: Home, end: true },
  { to: "/operating-subjects", label: "운영과목", icon: FileSpreadsheet },
  { to: "/course-selections", label: "수강신청", icon: Upload },
  { to: "/external-courses", label: "전입/외부 이수", icon: UserRoundPlus },
  { to: "/validation-rules", label: "점검 규칙", icon: Settings },
  { to: "/results", label: "점검 결과", icon: ListChecks },
  { to: "/student-report", label: "학생별 확인서", icon: ClipboardCheck },
  {
    to: "/student-selection-analysis",
    label: "학생 선택 분석",
    icon: Users,
    activePaths: ["/subject-enrollment", "/non-overlapping-subjects"]
  },
  { to: "/misc-tools", label: "기타 도구", icon: Wrench }
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="nav">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive || item.activePaths?.includes(location.pathname)
                ? "nav__link nav__link--active"
                : "nav__link"
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
