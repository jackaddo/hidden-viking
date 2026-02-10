"use client";

interface DataPoint {
    label: string;
    value: number;
}

export default function AnalyticsChart({ data, title }: { data: DataPoint[], title: string }) {
    const maxValue = Math.max(...data.map(d => d.value), 100);

    return (
        <div className="card">
            <h3 style={{ marginBottom: "1.5rem" }}>{title}</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", height: "200px", padding: "0 10px" }}>
                {data.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div
                            style={{
                                width: "100%",
                                height: `${(d.value / maxValue) * 100}%`,
                                backgroundColor: i % 2 === 0 ? "var(--primary)" : "var(--secondary)",
                                borderRadius: "4px 4px 0 0",
                                transition: "height 1s ease-out"
                            }}
                        />
                        <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textAlign: "center", height: "30px", overflow: "hidden" }}>
                            {d.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
