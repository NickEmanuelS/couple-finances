import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./ui/Card";
import { PEOPLE, COLORS_PERSON } from "../constants";
import { fmt, parseDate } from "../utils/finance";

const FilterBar = ({ filterPerson, filterType, onPersonChange, onTypeChange }) => (
  <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
    {["Todos", ...PEOPLE].map(p => (
      <button key={p} onClick={() => onPersonChange(p)}
        style={{
          padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
          background: filterPerson === p ? "#6366f1" : "#f1f5f9",
          color: filterPerson === p ? "white" : "#64748b",
        }}>
        {p}
      </button>
    ))}
    <div style={{ width: 1, background: "#e2e8f0", margin: "0 2px" }} />
    {[["Todos", "Todos"], ["income", "Entradas"], ["expense", "Saidas"]].map(([v, l]) => (
      <button key={v} onClick={() => onTypeChange(v)}
        style={{
          padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
          background: filterType === v ? "#6366f1" : "#f1f5f9",
          color: filterType === v ? "white" : "#64748b",
        }}>
        {l}
      </button>
    ))}
  </div>
);

const TransactionItem = ({ tx, onEdit, onDelete }) => {
  const pi = PEOPLE.indexOf(tx.person);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: tx.type === "income" ? "#dcfce7" : "#fee2e2",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {tx.type === "income"
          ? <TrendingUp size={18} color="#16a34a" />
          : <TrendingDown size={18} color="#dc2626" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.desc}</div>
        <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", gap: 4 }}>
          <span>{tx.category}</span><span>·</span>
          <span style={{ color: COLORS_PERSON[pi], fontWeight: 600 }}>{tx.person}</span><span>·</span>
          <span>{parseDate(tx.date).toLocaleDateString("pt-BR")}</span>
        </div>
      </div>
      <div style={{ fontWeight: 700, color: tx.type === "income" ? "#16a34a" : "#dc2626", flexShrink: 0 }}>
        {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={() => onEdit(tx)} style={{ background: "#e0e7ff", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Pencil size={14} color="#6366f1" />
        </button>
        <button onClick={() => onDelete(tx.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Trash2 size={14} color="#dc2626" />
        </button>
      </div>
    </div>
  );
};

export const TransactionList = ({ transactions, filterPerson, filterType, onPersonChange, onTypeChange, onEdit, onDelete }) => {
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Card>
      <FilterBar
        filterPerson={filterPerson}
        filterType={filterType}
        onPersonChange={onPersonChange}
        onTypeChange={onTypeChange}
      />
      {sorted.length === 0
        ? <p style={{ textAlign: "center", color: "#94a3b8", padding: 30 }}>Nenhum lancamento encontrado.</p>
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sorted.map(t => (
              <TransactionItem key={t.id} tx={t} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        )
      }
    </Card>
  );
};
