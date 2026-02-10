/**
 * Paradise Preparatory School Grading & Logic
 * 
 * Rules:
 * 80–100 → Grade 1 (Highest)
 * 70–79 → Grade 2 (Higher)
 * 65–69 → Grade 3 (High)
 * 60–64 → Grade 4 (High Average)
 * 55–59 → Grade 5 (Average)
 * 50–54 → Grade 6 (Low Average)
 * 40–49 → Grade 7 (Low)
 * 35–39 → Grade 8 (Lower)
 * 0–34 → Grade 9 (Lowest)
 */

export const GRADES = [
    { min: 80, max: 100, grade: 1, remark: "Highest" },
    { min: 70, max: 79, grade: 2, remark: "Higher" },
    { min: 65, max: 69, grade: 3, remark: "High" },
    { min: 60, max: 64, grade: 4, remark: "High Average" },
    { min: 55, max: 59, grade: 5, remark: "Average" },
    { min: 50, max: 54, grade: 6, remark: "Low Average" },
    { min: 40, max: 49, grade: 7, remark: "Low" },
    { min: 35, max: 39, grade: 8, remark: "Lower" },
    { min: 0, max: 34, grade: 9, remark: "Lowest" },
];

export function calculateGrade(score: number) {
    const result = GRADES.find((g) => score >= g.min && score <= g.max);
    return result || { grade: 9, remark: "Lowest" };
}

/**
 * Aggregate Calculation Rules:
 * - 4 Core subjects (English, Maths, Science, Social Studies)
 * - Best 2 elective grades
 * - Aggregate = sum of 6 subject grades
 */
export function calculateAggregate(scores: { subjectName: string; type: string; grade: number }[]) {
    const coreSubjects = ["English Language", "Mathematics", "Integrated Science", "Social Studies"];

    const coreGrades = scores
        .filter((s) => coreSubjects.includes(s.subjectName))
        .map((s) => s.grade);

    // If any core is missing, we can't calculate a standard aggregate (or treat as 9?)
    // For now, assume all cores are provided or default them to 9.
    while (coreGrades.length < 4) {
        coreGrades.push(9);
    }

    const electiveGrades = scores
        .filter((s) => !coreSubjects.includes(s.subjectName) && s.type === "ELECTIVE")
        .map((s) => s.grade)
        .sort((a, b) => a - b); // Lowest grade numbers are better

    const bestTwoElectives = electiveGrades.slice(0, 2);
    while (bestTwoElectives.length < 2) {
        bestTwoElectives.push(9);
    }

    const total = [...coreGrades, ...bestTwoElectives].reduce((sum, g) => sum + g, 0);
    return Math.min(Math.max(total, 6), 54);
}
