import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "TEACHER") {
        redirect("/auth/login");
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside style={{
                width: "260px",
                background: "var(--primary-dark)",
                color: "white",
                display: "flex",
                flexDirection: "column",
                padding: "2rem 0"
            }}>
                <div style={{ padding: "0 2rem", marginBottom: "3rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--secondary)" }}>Paradise Teacher</h2>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <Link href="/teacher/dashboard" style={navStyle}>My Dashboard</Link>
                    <Link href="/teacher/scores" style={navStyle}>Enter Mock Scores</Link>
                </nav>

                <div style={{ padding: "2rem" }}>
                    <Link href="/api/auth/signout" style={{ color: "var(--secondary-light)", fontSize: "0.9rem" }}>Sign Out</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, backgroundColor: "var(--bg-main)", overflowY: "auto" }}>
                <header style={{
                    backgroundColor: "white",
                    padding: "1rem 2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--border-color)"
                }}>
                    <h1 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{session.user.name}</h1>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Teacher Dashboard</div>
                </header>

                <div style={{ padding: "2rem" }}>
                    {children}
                </div>
            </main>
        </div>
    );
}

const navStyle = {
    padding: "1rem 2rem",
    fontSize: "0.95rem",
    fontWeight: 500,
    transition: "var(--transition)",
    borderLeft: "4px solid transparent",
    color: "rgba(255, 255, 255, 0.8)"
};
