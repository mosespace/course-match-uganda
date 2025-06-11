type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'O' | 'F';

const gradeToPoints: Record<Grade, number> = {
  A: 6,
  B: 5,
  C: 4,
  D: 3,
  E: 2,
  O: 1,
  F: 0,
};

// Helper for O-Level grade to points
const oLevelGradeToPoints = (grade: number): number => {
  if (grade >= 1 && grade <= 2) return 0.3;
  if (grade >= 3 && grade <= 6) return 0.2;
  if (grade >= 7 && grade <= 8) return 0.1;
  return 0;
};

interface StudentSubject {
  subjectName: string;
  grade: Grade;
}

interface CourseRequiredSubject {
  subjectName: string;
  category: 'Essential' | 'Relevant' | 'Desirable' | 'Other';
}

const calculateCourseScore = (
  studentSubjects: StudentSubject[],
  courseSubjects: CourseRequiredSubject[],
  oLevelGrades: number[],
  isFemale: boolean,
): number => {
  let total = 0;

  // Loop through required subjects for the course
  courseSubjects.forEach((requiredSubject) => {
    const studentSubject = studentSubjects.find(
      (s) =>
        s.subjectName.toLowerCase() ===
        requiredSubject.subjectName.toLowerCase(),
    );

    if (studentSubject) {
      const points = gradeToPoints[studentSubject.grade];
      let weight = 0;
      switch (requiredSubject.category) {
        case 'Essential':
          weight = 3;
          break;
        case 'Relevant':
          weight = 2;
          break;
        case 'Desirable':
          weight = 1;
          break;
        default:
          weight = 0.5;
      }
      total += points * weight;
    }
  });

  // Add O-Level contributions
  const oLevelBonus = oLevelGrades.reduce(
    (sum, grade) => sum + oLevelGradeToPoints(grade),
    0,
  );

  total += oLevelBonus;

  // Add female bonus
  if (isFemale) {
    total += 1.5;
  }

  return total;
};
