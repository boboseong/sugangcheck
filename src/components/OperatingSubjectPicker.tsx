import { useId, useMemo, useState } from "react";
import { normalizeSubjectName } from "../normalizers/normalizeSubjectName";
import type { Semester } from "../types/semester";
import type { OperatingSubject } from "../types/subject";
import { semesterLabel } from "../utils/semester";

export type OperatingSubjectPickerOption = {
  key: string;
  subjectName: string;
  normalizedSubjectName: string;
  metadata: string;
};

type BuildOperatingSubjectPickerOptionsInput = {
  target?: Semester;
};

type OperatingSubjectPickerProps = {
  disabled?: boolean;
  hideLabel?: boolean;
  label: string;
  options: readonly OperatingSubjectPickerOption[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

function addSortedPart(parts: string[], values: Set<string>) {
  const text = [...values]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right, "ko", { numeric: true }))
    .join(", ");

  if (text) {
    parts.push(text);
  }
}

export function buildOperatingSubjectPickerOptions(
  operatingSubjects: readonly OperatingSubject[],
  input: BuildOperatingSubjectPickerOptionsInput = {}
): OperatingSubjectPickerOption[] {
  const buckets = new Map<
    string,
    {
      subjectName: string;
      normalizedSubjectName: string;
      semesters: Set<string>;
      subjectGroups: Set<string>;
      credits: Set<string>;
      selectionTypes: Set<string>;
    }
  >();

  operatingSubjects
    .filter(
      (subject) =>
        !input.target ||
        (subject.target.grade === input.target.grade &&
          subject.target.semester === input.target.semester)
    )
    .forEach((subject) => {
      const key = [
        subject.normalizedSubjectName,
        subject.subjectName,
        subject.subjectGroup,
        subject.credits,
        subject.selectionType
      ].join("|");
      const bucket =
        buckets.get(key) ??
        {
          subjectName: subject.subjectName,
          normalizedSubjectName: subject.normalizedSubjectName,
          semesters: new Set<string>(),
          subjectGroups: new Set<string>(),
          credits: new Set<string>(),
          selectionTypes: new Set<string>()
        };

      bucket.semesters.add(semesterLabel(subject.target));
      bucket.subjectGroups.add(subject.subjectGroup);
      bucket.credits.add(`${subject.credits}학점`);
      bucket.selectionTypes.add(subject.selectionType);
      buckets.set(key, bucket);
    });

  return [...buckets.entries()]
    .map(([key, bucket]) => {
      const metadataParts: string[] = [];

      addSortedPart(metadataParts, bucket.semesters);
      addSortedPart(metadataParts, bucket.subjectGroups);
      addSortedPart(metadataParts, bucket.credits);
      addSortedPart(metadataParts, bucket.selectionTypes);

      return {
        key,
        subjectName: bucket.subjectName,
        normalizedSubjectName: bucket.normalizedSubjectName,
        metadata: metadataParts.join(" · ")
      };
    })
    .sort((left, right) =>
      left.subjectName.localeCompare(right.subjectName, "ko", { numeric: true })
    );
}

function optionMatchesQuery(
  option: OperatingSubjectPickerOption,
  query: string
): boolean {
  const normalizedQuery = normalizeSubjectName(query);
  const loweredQuery = query.trim().toLocaleLowerCase();

  if (!loweredQuery) {
    return true;
  }

  return (
    option.subjectName.toLocaleLowerCase().includes(loweredQuery) ||
    option.normalizedSubjectName.includes(normalizedQuery) ||
    option.metadata.toLocaleLowerCase().includes(loweredQuery)
  );
}

function isOperatingSubjectName(
  options: readonly OperatingSubjectPickerOption[],
  value: string
) {
  const normalizedValue = normalizeSubjectName(value);

  return options.some(
    (option) =>
      option.subjectName === value || option.normalizedSubjectName === normalizedValue
  );
}

export function OperatingSubjectPicker({
  disabled = false,
  hideLabel = false,
  label,
  options,
  placeholder,
  value,
  onChange
}: OperatingSubjectPickerProps) {
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const trimmedValue = value.trim();
  const hasOptions = options.length > 0;
  const hasMatch = hasOptions && isOperatingSubjectName(options, trimmedValue);
  const filteredOptions = useMemo(
    () => options.filter((option) => optionMatchesQuery(option, value)).slice(0, 12),
    [options, value]
  );

  function selectOption(option: OperatingSubjectPickerOption) {
    onChange(option.subjectName);
    setIsOpen(false);
  }

  return (
    <div className="subject-picker">
      <label>
        <span className={hideLabel ? "subject-picker__label--hidden" : ""}>
          {label}
        </span>
        <input
          aria-controls={listboxId}
          aria-expanded={isOpen}
          autoComplete="off"
          disabled={disabled}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          role="combobox"
          value={value}
        />
      </label>
      {trimmedValue && hasOptions ? (
        <span
          className={[
            "subject-picker__status",
            hasMatch
              ? "subject-picker__status--matched"
              : "subject-picker__status--unmatched"
          ].join(" ")}
        >
          {hasMatch ? "운영과목에서 선택" : "운영과목에 없는 이름"}
        </span>
      ) : null}
      {isOpen && !disabled ? (
        <div className="subject-picker__listbox" id={listboxId} role="listbox">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                className="subject-picker__option"
                key={option.key}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectOption(option);
                }}
                role="option"
                type="button"
              >
                <strong>{option.subjectName}</strong>
                <span>{option.metadata}</span>
              </button>
            ))
          ) : (
            <div className="subject-picker__empty">
              일치하는 운영과목이 없습니다.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
