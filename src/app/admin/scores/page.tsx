"use client";

import { useState, useEffect } from "react";

interface Candidate {
    id: string;
    indexNumber: string;
    firstName: string;
    surname: string;
}

interface Subject {
    id: string;
    name: string;
    type: string;
}

export default function MasterScoreEntry() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [scores, setScores] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [candRes, subjRes] = await Promise.all([
            fetch("/api/candidates"),
            fetch("/api/subjects")
        ]);
        const candData = await candRes.json();
        const subjData = await subjRes.json();

        if (candData.candidates) setCandidates(candData.candidates);
        if (subjData.subjects) setSubjects(subjData.subjects);
    };

    const handleScoreChange = (candidateId: string, value: string) => {
        const score = parseFloat(value);
        setScores(prev => ({ ...prev, [candidateId]: score }));
    };

    const saveScores = async () => {
        if (!selectedSubject) return alert("Select a subject first");
        setLoading(true);

        try {
            const res = await fetch("/api/scores/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subjectId: selectedSubject,
                    scores: Object.entries(scores).map(([candidateId, score]) => ({
                        candidateId,
                        score
                    }))
                })
            });

            if (res.ok) alert("Scores saved successfully!");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: "2rem", color: "var(--primary)" }}>Master Score Entry</h2>

            <div className="card" style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "center", marginBottom: "1rem" }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Select Subject</label>
                        <select
                            style={inputStyle}
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            <option value="">-- Choose Subject --</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
                        </select>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={saveScores}
                        disabled={loading || !selectedSubject}
                        style={{ alignSelf: "end", padding: "12px 24px" }}
                    >
                        {loading ? "Saving..." : "Save All Scores"}
                    </button>
                </div>
            </div>

            <div className="card">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left", borderBottom: "2px solid var(--border-color)" }}>
                            <th style={thStyle}>Index Number</th>
                            <th style={thStyle}>Candidate Name</th>
                            <th style={thStyle}>Score (0-100)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((c) => (
                            <tr key={c.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                <td style={tdStyle}>{c.indexNumber}</td>
                                <td style={tdStyle}>{c.surname}, {c.firstName}</td>
                                <td style={tdStyle}>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder="Enter mark"
                                        style={{ ...inputStyle, width: "120px" }}
                                        onChange={(e) => handleScoreChange(c.id, e.target.value)}
                                    />
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
