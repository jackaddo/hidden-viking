"use client";

import { useState, useEffect } from "react";

interface Teacher {
    id: string;
    fullName: string;
    phoneNumber: string;
}

export default function TeacherManagement() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        const res = await fetch("/api/teachers");
        const data = await res.json();
        if (data.teachers) setTeachers(data.teachers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/teachers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, phoneNumber, password }),
            });

            if (res.ok) {
                setFullName("");
                setPhoneNumber("");
                setPassword("");
                fetchTeachers();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: "2rem", color: "var(--primary)" }}>Manage Teachers</h2>

            <div className="card" style={{ marginBottom: "2rem" }}>
                <h3 style={{ marginBottom: "1.5rem" }}>Add New Teacher</h3>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Phone Number (Login)</label>
                        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Adding..." : "Add Teacher"}
                    </button>
                </form>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: "1.5rem" }}>Teacher List</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left", borderBottom: "2px solid var(--border-color)" }}>
                            <th style={thStyle}>Full Name</th>
                            <th style={thStyle}>Phone Number</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((t) => (
                            <tr key={t.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                <td style={tdStyle}>{t.fullName}</td>
                                <td style={tdStyle}>{t.phoneNumber}</td>
                                <td style={tdStyle}>
                                    <button style={{ color: "var(--error)", border: "none", background: "none", cursor: "pointer" }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const labelStyle = { display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "4px", color: "var(--text-secondary)" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "var(--radius)", border: "1px solid var(--border-color)" };
const thStyle = { padding: "12px", fontSize: "0.9rem", color: "var(--text-secondary)" };
const tdStyle = { padding: "12px", fontSize: "0.95rem" };
