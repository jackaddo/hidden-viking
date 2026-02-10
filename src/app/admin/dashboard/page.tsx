import prisma from "@/lib/prisma";
import AnalyticsChart from "@/components/AnalyticsChart";

export default async function AdminDashboard() {
    const teacherCount = await prisma.user.count({ where: { role: "TEACHER" } });
    const candidateCount = await prisma.candidate.count();
    const subjectCount = await prisma.subject.count();

    return (
        <div>
            <h2 style={{ marginBottom: "2rem", fontSize: "1.8rem", color: "var(--primary)" }}>Overview</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
                <div className="card">
                    <small style={{ color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Total Teachers</small>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)" }}>{teacherCount}</div>
                </div>

                <div className="card">
                    <small style={{ color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Total Candidates</small>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)" }}>{candidateCount}</div>
                </div>

                <div className="card">
                    <small style={{ color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Subjects</small>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)" }}>{subjectCount}</div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
                <AnalyticsChart
                    title="Subject Performance Average"
                    data={[
                        { label: "Maths", value: 75 },
                        { label: "English", value: 68 },
                        { label: "Science", value: 82 },
                        { label: "Social", value: 70 },
                        { label: "Computing", value: 90 }
                    ]}
                />
                <AnalyticsChart
                    title="Candidate Enrollment"
                    data={[
                        { label: "2021", value: 120 },
                        { label: "2022", value: 150 },
                        { label: "2023", value: 180 },
                        { label: "2024", value: 210 }
                    ]}
                />
            </div>

            <div className="card" style={{ marginTop: "2rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Quick Actions</h3>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button className="btn-primary">Add Candidate</button>
                    <button className="btn-secondary">Upload Scores</button>
                </div>
            </div>
        </div>
    );
}
