import { PageHeader } from "../components/ui/PageHeader";

export function NonOverlappingSubjectsPage() {
  return (
    <section className="page">
      <PageHeader
        title="미중복 선택 과목"
        description="학생 선택 분석의 미중복 선택 과목 결과를 확인합니다."
      />
      <div className="empty-panel">
        <p>미중복 선택 과목 분석 결과가 여기에 표시됩니다.</p>
      </div>
    </section>
  );
}
