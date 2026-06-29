import {
  ClipboardCheck,
  FileSpreadsheet,
  Home,
  ListChecks,
  Lock,
  Settings,
  Upload,
  UserRoundPlus,
  Wrench
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "대시보드", icon: Home, end: true },
  { to: "/operating-subjects", label: "운영과목", icon: FileSpreadsheet },
  { to: "/course-selections", label: "수강신청", icon: Upload },
  { to: "/external-courses", label: "전입/외부 이수", icon: UserRoundPlus },
  { to: "/validation-rules", label: "검증 규칙", icon: Settings },
  { to: "/results", label: "검증 결과", icon: ListChecks },
  { to: "/student-report", label: "학생별 확인서", icon: ClipboardCheck },
  { to: "/misc-tools", label: "기타 도구", icon: Wrench },
  { to: "/privacy", label: "개인정보", icon: Lock }
];

export function Navigation() {
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
              isActive ? "nav__link nav__link--active" : "nav__link"
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
