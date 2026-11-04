export interface StudentEnrolment {
  sectionId: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  academicYear: {
    name: string;
    status: string;
  };
  section: {
    name: string;
    class: {
      name: string;
    };
  };
}

export function studentClassLabel(enrolments: StudentEnrolment[] | null | undefined): string {
  if (!enrolments?.length) return '—';

  return enrolments
    .map(({ academicYear, section }) =>
      [academicYear?.name, section?.class?.name, section?.name]
        .filter((value): value is string => Boolean(value))
        .join(' · '),
    )
    .filter(Boolean)
    .join(', ') || '—';
}

export function isEnrolledForSession(
  enrolment: StudentEnrolment,
  sectionId: string | undefined,
  sessionDate: string | undefined,
): boolean {
  if (!sectionId || !sessionDate || !enrolment.isActive || enrolment.sectionId !== sectionId) {
    return false;
  }

  const date = sessionDate.slice(0, 10);
  return (
    enrolment.startDate.slice(0, 10) <= date &&
    (enrolment.endDate === null || enrolment.endDate.slice(0, 10) >= date)
  );
}
