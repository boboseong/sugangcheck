import { GitCompare, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";

const analysisItems = [
  {
    to: "/subject-enrollment",
    label: "과목별 수강생",
    icon: Users
  },
  {
    to: "/non-overlapping-subjects",
    label: "미중복 선택 과목",
    icon: GitCompare
  }
];

export function StudentSelectionAnalysisPage() {
  return (
    <section className="page">
      <PageHeader
        title="학생 선택 분석"
        description="학생들의 수강신청 선택 결과를 기준별로 분석합니다."
      />
      <div className="analysis-action-grid">
        {analysisItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link className="analysis-action-card" key={item.to} to={item.to}>
              <Icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
