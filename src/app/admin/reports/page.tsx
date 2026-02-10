"use client";

import { useEffect, useState } from "react";
import { calculateGrade, calculateAggregate } from "@/lib/grading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Candidate {
    id: string;
    indexNumber: string;
    firstName: string;
    surname: string;
    scores: { score: number; subject: { name: string; type: string } }[];
}

export default function MockReportsSummary() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await fetch("/api/reports/candidates");
        const data = await res.json();
        if (data.candidates) setCandidates(data.candidates);
    };

    const generateFullPDF = () => {
        const doc = new jsPDF("l", "mm", "a4");
        doc.setFontSize(20);
        doc.text("Paradise Preparatory School - Full Mock Summary Report", 148, 20, { align: "center" });

        const tableData = candidates.map((c) => {
            const eng = c.scores.find(s => s.subject.name === "English Language")?.score ?? "-";
            const math = c.scores.find(s => s.subject.name === "Mathematics")?.score ?? "-";
            const sci = c.scores.find(s => s.subject.name === "Integrated Science")?.score ?? "-";
            const soc = c.scores.find(s => s.subject.name === "Social Studies")?.score ?? "-";

            const agg = calculateAggregate(c.scores.map(s => ({
                subjectName: s.subject.name,
                type: s.subject.type,
                grade: calculateGrade(s.score).grade
            })));

            return [c.indexNumber, `${c.surname}, ${c.firstName}`, eng, math, sci, soc, agg];
        });

        autoTable(doc, {
            startY: 30,
            head: [["Index No.", "Candidate Name", "English", "Maths", "Science", "Social", "Aggregate"]],
            body: tableData,
            headStyles: { fillColor: [26, 35, 126] },
        });

        doc.save("Full_Mock_Summary_Report.pdf");
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ color: "var(--primary)" }}>Full Mock Summary Report</h2>
                <button className="btn-secondary" onClick={generateFullPDF}>Download Full PDF Report</button>
            </div>

            <div className="card" style={{ padding: "0", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
                    <thead>
                        <tr style={{ background: "var(--primary)", color: "white", textAlign: "left" }}>
                            <th style={thStyle}>Index No.</th>
                            <th style={thStyle}>Candidate Name</th>
                            <th style={thStyle}>English</th>
                            <th style={thStyle}>Maths</th>
                            <th style={thStyle}>Science</th>
                            <th style={thStyle}>Social</th>
                            <th style={thStyle}>Aggregate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((c) => {
                            const eng = c.scores.find(s => s.subject.name === "English Language")?.score ?? "-";
                            const math = c.scores.find(s => s.subject.name === "Mathematics")?.score ?? "-";
                            const sci = c.scores.find(s => s.subject.name === "Integrated Science")?.score ?? "-";
                            const soc = c.scores.find(s => s.subject.name === "Social Studies")?.score ?? "-";

                            const agg = calculateAggregate(c.scores.map(s => ({
                                subjectName: s.subject.name,
                                type: s.subject.type,
                                grade: calculateGrade(s.score).grade
                            })));

                            return (
                                <tr key={c.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                    <td style={tdStyle}>{c.indexNumber}</td>
                                    <td style={tdStyle}>{c.surname}, {c.firstName}</td>
                                    <td style={tdStyle}>{eng}</td>
                                    <td style={tdStyle}>{math}</td>
                                    <td style={tdStyle}>{sci}</td>
                                    <td style={tdStyle}>{soc}</td>
                                    <td style={{ ...tdStyle, fontWeight: "bold", color: "var(--primary)" }}>{agg}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = { padding: "16px 20px", fontSize: "0.85rem", fontWeight: 600, color: "white" };
const tdStyle = { padding: "16px 20px", fontSize: "0.9rem" };
