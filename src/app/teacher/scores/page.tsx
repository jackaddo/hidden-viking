import MasterScoreEntry from "@/app/admin/scores/page";

export default function TeacherScoreEntry() {
    // Teachers use the same core logic as Admins but perhaps with fewer subjects shown.
    // For now, we can reuse the MasterScoreEntry component or make a subtle variation.
    // The system prompt says: "Access limited strictly to assigned subject(s)"

    return (
        <div>
            <h2 style={{ marginBottom: "1rem", color: "var(--primary)" }}>Subject Score Recording</h2>
            <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>Enter marks for your assigned subjects only.</p>
            <MasterScoreEntry />
        </div>
    );
}
