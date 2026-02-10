"use client";

import { useState, useEffect } from "react";

interface Candidate {
    id: string;
    indexNumber: string;
    firstName: string;
    surname: string;
    dob: string;
}

export default function CandidateManagement() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [dob, setDob] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        const res = await fetch("/api/candidates");
        const data = await res.json();
        if (data.candidates) setCandidates(data.candidates);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/candidates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, surname, dob }),
            });

            if (res.ok) {
                setFirstName("");
                setSurname("");
                setDob("");
                fetchCandidates();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: "2rem", color: "var(--primary)" }}>Manage Candidates</h2>

            <div className="card" style={{ marginBottom: "2rem" }}>
                <h3 style={{ marginBottom: "1.5rem" }}>Add New Candidate</h3>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
                    <div>
                        <label style={labelStyle}>Surname</label>
                        <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Date of Birth</label>
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required style={inputStyle} />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Adding..." : "Add Candidate"}
                    </button>
                </form>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: "1.5rem" }}>Candidate List</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left", borderBottom: "2px solid var(--border-color)" }}>
                            <th style={thStyle}>Index Number</th>
                            <th style={thStyle}>Full Name</th>
                            <th style={thStyle}>DOB</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((c) => (
                            <tr key={c.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                <td style={tdStyle}>{c.indexNumber}</td>
                                <td style={tdStyle}>{c.surname}, {c.firstName}</td>
                                <td style={tdStyle}>{new Date(c.dob).toLocaleDateString()}</td>
                                <td style={tdStyle}>
                                    <button style={{ color: "var(--error)", background: "none", padding: 0 }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {candidates.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                                    No candidates found.
                                </td>
                            </tr>
                        )}
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
