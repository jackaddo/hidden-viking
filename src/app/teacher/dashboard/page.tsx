import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TeacherDashboard() {
    const session = await getServerSession(authOptions);

    // In a real scenario, we'd fetch subjects assigned to this specific teacher
    // For now, let's just show general stats or subjects they might be in charge of.
    const candidateCount = await prisma.candidate.count();

    return (
        <div>
            <h2 style={{ marginBottom: "2rem", fontSize: "1.8rem", color: "var(--primary)" }}>Welcome, {session?.user?.name}</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                <div className="card">
                    <small style={{ color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Total Students</small>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)" }}>{candidateCount}</div>
                </div>

                <div className="card">
                    <small style={{ color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>Assigned Subjects</small>
                    <div style={{ fontSize: "1.2rem", fontWeight: 600, marginTop: "10px" }}>
                        {/* This would be dynamic based on teacher record */}
                        Mathematics, Integrated Science
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: "2rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Academic Performance Insights</h3>
                <p style={{ color: "var(--text-secondary)" }}>Performance charts and analytics will appear here once scores are fully recorded.</p>
            </div>
        </div>
    );
}
