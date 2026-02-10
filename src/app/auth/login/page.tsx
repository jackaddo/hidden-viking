"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                phoneNumber,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid phone number or password");
            } else {
                // Redirection based on role will happen in a middleware or a useEffect elsewhere,
                // but for now, let's just go to a dashboard and let middleware handle protection.
                router.push("/dashboard");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={
            {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)"
            }
        }>
            <div className="card" style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
                <h1 style={{ color: "var(--primary)", marginBottom: "1rem", fontWeight: 800 }}>Paradise Prep</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Report Management System</p>

                {error && <div style={{ color: "var(--error)", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Phone Number</label>
                        <input
                            type="text"
                            placeholder="0XXXXXXXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "var(--radius)",
                                border: "1px solid var(--border-color)",
                                marginTop: "4px"
                            }}
                        />
                    </div>
                    <div style={{ textAlign: "left" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "var(--radius)",
                                border: "1px solid var(--border-color)",
                                marginTop: "4px"
                            }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "1rem", padding: "14px" }}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    &copy; {new Date().getFullYear()} Paradise Preparatory School
                </p>
            </div >
        </div >
    );
}
