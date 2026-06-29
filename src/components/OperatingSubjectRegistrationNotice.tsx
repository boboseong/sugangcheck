import { FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { unregisteredOperatingSubjectIssueMessage } from "../validation/dataPreparationIssues";

export function OperatingSubjectRegistrationNotice() {
  return (
    <div className="validation-run-notice" role="alert">
      <p>{unregisteredOperatingSubjectIssueMessage}</p>
      <div className="validation-run-notice__actions">
        <Link className="button button--secondary" to="/operating-subjects">
          <FileSpreadsheet size={16} />
          <span>운영과목 이동</span>
        </Link>
      </div>
    </div>
  );
}
