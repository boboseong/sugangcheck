import { createHashRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { AboutPage } from "../pages/AboutPage";
import { CourseSelectionsPage } from "../pages/CourseSelectionsPage";
import { ExternalCoursesPage } from "../pages/ExternalCoursesPage";
import { HomePage } from "../pages/HomePage";
import { MiscToolsPage } from "../pages/MiscToolsPage";
import { OperatingSubjectsPage } from "../pages/OperatingSubjectsPage";
import { StudentReportPage } from "../pages/StudentReportPage";
import { ValidationResultsPage } from "../pages/ValidationResultsPage";
import { ValidationRulesPage } from "../pages/ValidationRulesPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "operating-subjects", element: <OperatingSubjectsPage /> },
      { path: "course-selections", element: <CourseSelectionsPage /> },
      { path: "external-courses", element: <ExternalCoursesPage /> },
      { path: "validation-rules", element: <ValidationRulesPage /> },
      { path: "results", element: <ValidationResultsPage /> },
      { path: "student-report", element: <StudentReportPage /> },
      { path: "misc-tools", element: <MiscToolsPage /> },
      { path: "about", element: <AboutPage /> }
    ]
  }
]);
