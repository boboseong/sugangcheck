import { lazy } from "react";
import { createHashRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";

// Pages are loaded per route so that the Excel and zip machinery they pull in
// (xlsx, jszip, the export/* modules) stays out of the initial chunk.
const AboutPage = lazy(() =>
  import("../pages/AboutPage").then((m) => ({ default: m.AboutPage }))
);
const CourseSelectionsPage = lazy(() =>
  import("../pages/CourseSelectionsPage").then((m) => ({
    default: m.CourseSelectionsPage
  }))
);
const DetailedSelectionAnalysisPage = lazy(() =>
  import("../pages/DetailedSelectionAnalysisPage").then((m) => ({
    default: m.DetailedSelectionAnalysisPage
  }))
);
const ExternalCoursesPage = lazy(() =>
  import("../pages/ExternalCoursesPage").then((m) => ({
    default: m.ExternalCoursesPage
  }))
);
const HomePage = lazy(() =>
  import("../pages/HomePage").then((m) => ({ default: m.HomePage }))
);
const MiscToolsPage = lazy(() =>
  import("../pages/MiscToolsPage").then((m) => ({ default: m.MiscToolsPage }))
);
const NonOverlappingSubjectsPage = lazy(() =>
  import("../pages/NonOverlappingSubjectsPage").then((m) => ({
    default: m.NonOverlappingSubjectsPage
  }))
);
const OperatingSubjectsPage = lazy(() =>
  import("../pages/OperatingSubjectsPage").then((m) => ({
    default: m.OperatingSubjectsPage
  }))
);
const StudentReportPage = lazy(() =>
  import("../pages/StudentReportPage").then((m) => ({
    default: m.StudentReportPage
  }))
);
const StudentSelectionAnalysisPage = lazy(() =>
  import("../pages/StudentSelectionAnalysisPage").then((m) => ({
    default: m.StudentSelectionAnalysisPage
  }))
);
const SubjectEnrollmentPage = lazy(() =>
  import("../pages/SubjectEnrollmentPage").then((m) => ({
    default: m.SubjectEnrollmentPage
  }))
);
const ValidationResultsPage = lazy(() =>
  import("../pages/ValidationResultsPage").then((m) => ({
    default: m.ValidationResultsPage
  }))
);
const ValidationRulesPage = lazy(() =>
  import("../pages/ValidationRulesPage").then((m) => ({
    default: m.ValidationRulesPage
  }))
);

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "operating-subjects", element: <OperatingSubjectsPage /> },
      { path: "course-selections", element: <CourseSelectionsPage /> },
      { path: "subject-enrollment", element: <SubjectEnrollmentPage /> },
      {
        path: "student-selection-analysis",
        element: <StudentSelectionAnalysisPage />
      },
      {
        path: "detailed-selection-analysis",
        element: <DetailedSelectionAnalysisPage />
      },
      { path: "non-overlapping-subjects", element: <NonOverlappingSubjectsPage /> },
      { path: "external-courses", element: <ExternalCoursesPage /> },
      { path: "validation-rules", element: <ValidationRulesPage /> },
      { path: "results", element: <ValidationResultsPage /> },
      { path: "student-report", element: <StudentReportPage /> },
      { path: "misc-tools", element: <MiscToolsPage /> },
      { path: "about", element: <AboutPage /> }
    ]
  }
]);
