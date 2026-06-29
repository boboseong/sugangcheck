import { useEffect, useRef, useState } from "react";
import { useCourseSelectionRawStore } from "../state/courseSelectionRawStore";
import { useExternalCourseInputStore } from "../state/externalCourseInputStore";
import { useImportStatusStore } from "../state/importStatusStore";
import { useNormalizedCourseSelectionStore } from "../state/normalizedCourseSelectionStore";
import { useOperatingSubjectStore } from "../state/operatingSubjectStore";
import {
  initializeProjectWorkspace,
  isProjectHydrating,
  saveCurrentProjectSnapshot
} from "../state/projectWorkspace";
import { usePrerequisiteRuleStore } from "../state/prerequisiteRuleStore";
import { useStudentSemesterPresenceStore } from "../state/studentSemesterPresenceStore";
import { useStudentStore } from "../state/studentStore";
import { useValidationResultStore } from "../state/validationResultStore";
import { useValidationRuleSettingStore } from "../state/validationRuleSettingStore";

const autosaveDelayMs = 450;

export function ProjectPersistenceProvider() {
  const [ready, setReady] = useState(false);
  const saveTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let alive = true;

    initializeProjectWorkspace()
      .then(() => {
        if (alive) {
          setReady(true);
        }
      })
      .catch((error) => {
        console.error("프로젝트를 초기화하지 못했습니다.", error);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return undefined;
    }

    const scheduleSave = () => {
      if (isProjectHydrating()) {
        return;
      }

      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(() => {
        saveCurrentProjectSnapshot().catch((error) => {
          console.error("프로젝트를 자동 저장하지 못했습니다.", error);
        });
      }, autosaveDelayMs);
    };

    const unsubscribers = [
      useImportStatusStore.subscribe(scheduleSave),
      useOperatingSubjectStore.subscribe(scheduleSave),
      useCourseSelectionRawStore.subscribe(scheduleSave),
      useStudentStore.subscribe(scheduleSave),
      useStudentSemesterPresenceStore.subscribe(scheduleSave),
      useExternalCourseInputStore.subscribe(scheduleSave),
      useValidationRuleSettingStore.subscribe(scheduleSave),
      usePrerequisiteRuleStore.subscribe(scheduleSave),
      useNormalizedCourseSelectionStore.subscribe(scheduleSave),
      useValidationResultStore.subscribe(scheduleSave)
    ];

    return () => {
      window.clearTimeout(saveTimerRef.current);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [ready]);

  return null;
}
