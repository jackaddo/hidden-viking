"use client";

import { useState, useEffect } from "react";
import { calculateGrade, calculateAggregate } from "@/lib/grading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Score {
    subject: { name: string; type: string };
    score: number;
}

interface Candidate {
    id: string;
    indexNumber: string;
    firstName: string;
    surname: string;
    dob: string;
    scores: Score[];
}

export default function IndividualReportCard() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        const res = await fetch("/api/reports/candidates");
        const data = await res.json();
        if (data.candidates) setCandidates(data.candidates);
    };

    const generatePDF = (candidate: Candidate) => {
        const doc = new jsPDF();
        const aggregate = calculateAggregate(candidate.scores.map(s => ({
            subjectName: s.subject.name,
            type: s.subject.type,
            grade: calculateGrade(s.score).grade
        })));

        doc.setFontSize(22);
        doc.setTextColor(26, 35, 126); // Deep Royal Blue
        doc.text("PARADISE PREPARATORY SCHOOL", 105, 20, { align: "center" });

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("MOCK EXAMINATION REPORT", 105, 30, { align: "center" });

        doc.setFontSize(10);
        doc.text(`Candidate Name: ${candidate.surname}, ${candidate.firstName}`, 20, 45);
        doc.text(`Index Number: ${candidate.indexNumber}`, 20, 52);
        doc.text(`Date of Birth: ${new Date(candidate.dob).toLocaleDateString()}`, 20, 59);
        doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 140, 45);

        const tableData = candidate.scores.map(s => {
            const g = calculateGrade(s.score);
            return [s.subject.name, s.score.toString(), g.grade.toString(), g.remark];
        });

        autoTable(doc, {
            startY: 70,
            head: [["Subject", "Score %", "Grade", "Remark"]],
            body: tableData,
            headStyles: { fillColor: [26, 35, 126] },
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`FINAL AGGREGATE: ${aggregate}`, 20, finalY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Headteacher's Comment: __________________________________________________", 20, finalY + 20);
        doc.text("Headteacher's Signature: __________________________________________________", 20, finalY + 40);

        doc.save(`${candidate.indexNumber}_Report.pdf`);
    };

    return (
        <div>
            <h2 style={{ marginBottom: "2rem", color: "var(--primary)" }}>Individual Candidate Reports</h2>

            <div className="card" style={{ marginBottom: "2rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Select Candidate</h3>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <select
                        style={inputStyle}
                        onChange={(e) => {
                            const cand = candidates.find(c => c.id === e.target.value);
                            setSelectedCandidate(cand || null);
                        }}
                    >
                        <option value="">-- Choose Candidate --</option>
                        {candidates.map(c => <option key={c.id} value={c.id}>{c.surname}, {c.firstName} ({c.indexNumber})</option>)}
                    </select>
                    {selectedCandidate && (
                        <button className="btn-primary" onClick={() => generatePDF(selectedCandidate)}>
                            Download PDF Report
                        </button>
                    )}
                </div>
            </div>

            {selectedCandidate && (
                <div className="card">
                    <h3 style={{ marginBottom: "1.5rem" }}>Report Preview</h3>
                    <div id="report-preview" style={{ padding: "2rem", border: "1px solid var(--border-color)", minHeight: "400px" }}>
                        <h2 style={{ textAlign: "center", color: "var(--primary)" }}>PARADISE PREPARATORY SCHOOL</h2>
                        <p style={{ textAlign: "center", marginBottom: "2rem" }}>MOCK EXAMINATION REPORT</p>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
                            <div>
                                <p><strong>Name:</strong> {selectedCandidate.surname}, {selectedCandidate.firstName}</p>
                                <p><strong>Index:</strong> {selectedCandidate.indexNumber}</p>
                            </div>
                            <div>
                                <p><strong>DOB:</strong> {new Date(selectedCandidate.dob).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
                            <thead>
                                <tr style={{ background: "var(--primary)", color: "white" }}>
                                    <th style={prevTh}>Subject</th>
                                    <th style={prevTh}>Score %</th>
                                    <th style={prevTh}>Grade</th>
                                    <th style={prevTh}>Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCandidate.scores.map(s => {
                                    const g = calculateGrade(s.score);
                                    return (
                                        <tr key={s.subject.name} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                            <td style={prevTd}>{s.subject.name}</td>
                                            <td style={prevTd}>{s.score}</td>
                                            <td style={prevTd}>{g.grade}</td>
                                            <td style={prevTd}>{g.remark}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--primary)" }}>
                                Final Aggregate: {calculateAggregate(selectedCandidate.scores.map(s => ({
                                    subjectName: s.subject.name,
                                    type: s.subject.type,
                                    grade: calculateGrade(s.score).grade
                                })))}
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ width: "80px", height: "80px", border: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem" }}>
                                    QR CODE
                                </div>
                                <div style={{ fontSize: "0.6rem", marginTop: "4px" }}>Verify Report</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const inputStyle = { flex: 1, padding: "10px", borderRadius: "var(--radius)", border: "1px solid var(--border-color)" };
const prevTh = { padding: "10px", textAlign: "left" as const };
const prevTd = { padding: "10px" };
