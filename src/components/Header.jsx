import { MONTHS } from "../constants";
import { fmt } from "../utils/finance";

export const Header = ({ month, year, onMonthChange, onYearChange, stats }) => (
  <div style={{
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
    borderRadius: 20, padding: "20px 24px", marginBottom: 16, color: "white",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="/couple-finances-logo.png"
          alt="Couple Finances"
          style={{ width: 52, height: 52, borderRadius: 14, background: "white", padding: 4, flexShrink: 0 }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Nicolas & Nicole</h1>
          <p style={{ margin: "4px 0 0", opacity: 0.85, fontSize: 13 }}>Controle financeiro do casal</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <select
          value={month}
          onChange={e => onMonthChange(+e.target.value)}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 10, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}
        >
          {MONTHS.map((m, i) => <option key={i} value={i} style={{ color: "#000" }}>{m}</option>)}
        </select>
        <select
          value={year}
          onChange={e => onYearChange(+e.target.value)}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 10, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}
        >
          {[2023, 2024, 2025, 2026, 2027].map(y => <option key={y} value={y} style={{ color: "#000" }}>{y}</option>)}
        </select>
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16 }}>
      {[
        { label: "Entradas", value: stats.totalInc },
        { label: "Saidas",   value: stats.totalExp },
        { label: "Saldo",    value: stats.totalBalance },
      ].map(c => (
        <div key={c.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px" }}>
          <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>{c.label}</p>
          <p style={{ margin: "2px 0 0", fontWeight: 700, fontSize: 15 }}>{fmt(c.value)}</p>
        </div>
      ))}
    </div>
  </div>
);
