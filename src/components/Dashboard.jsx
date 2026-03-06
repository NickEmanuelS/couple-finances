import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "./ui/Card";
import { SectionTitle } from "./ui/SectionTitle";
import { COLORS_PERSON, CAT_COLORS, MONTHS } from "../constants";
import { fmt, computeGoalProgress } from "../utils/finance";

const PersonCard = ({ person, colorIndex }) => (
  <Card>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        background: COLORS_PERSON[colorIndex] + "20",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
      }}>
        {colorIndex === 0 ? "👦" : "👧"}
      </div>
      <span style={{ fontWeight: 700, color: COLORS_PERSON[colorIndex] }}>{person.name}</span>
    </div>
    {[["Entradas", person.income, "#16a34a"], ["Saidas", person.expense, "#dc2626"], ["Saldo", person.balance, person.balance >= 0 ? "#16a34a" : "#dc2626"]].map(([l, v, c]) => (
      <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0", borderBottom: l === "Saidas" ? "1px solid #f1f5f9" : "none" }}>
        <span style={{ color: "#64748b" }}>{l}</span>
        <span style={{ fontWeight: l === "Saldo" ? 700 : 600, color: c }}>{fmt(v)}</span>
      </div>
    ))}
  </Card>
);

const GoalProgressMini = ({ goals }) => (
  <Card>
    <SectionTitle t="Progresso das Metas" />
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {goals.map(g => {
        const { pct } = computeGoalProgress(g);
        return (
          <div key={g.id}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{g.icon} {g.title}</span>
              <span style={{ color: "#64748b" }}>{fmt(g.saved)} / {fmt(g.target)}</span>
            </div>
            <div style={{ background: "#f1f5f9", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? "#10b981" : g.color, borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, textAlign: "right" }}>{pct.toFixed(0)}%</div>
          </div>
        );
      })}
    </div>
  </Card>
);

export const Dashboard = ({ stats, goals, monthTxs, month, year }) => {
  if (monthTxs.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", background: "white", borderRadius: 16 }}>
        <p style={{ fontSize: 40, margin: 0 }}>📭</p>
        <p>Nenhum lancamento em {MONTHS[month]}/{year}.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {stats.byPerson.map((p, i) => <PersonCard key={p.name} person={p} colorIndex={i} />)}
      </div>

      <Card>
        <SectionTitle t="Comparativo por Pessoa" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.byPerson}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${(v / 1000).toFixed(1)}k`} />
            <Tooltip formatter={v => fmt(v)} />
            <Legend />
            <Bar dataKey="income" name="Entradas" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Saidas" fill="#f87171" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {stats.catData.length > 0 && (
        <Card>
          <SectionTitle t="Gastos por Categoria" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <ResponsiveContainer width="45%" height={180}>
              <PieChart>
                <Pie data={stats.catData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={38}>
                  {stats.catData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              {stats.catData.slice(0, 8).map((c, i) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: CAT_COLORS[i % CAT_COLORS.length], flexShrink: 0 }} />
                  <span style={{ flex: 1, color: "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                  <span style={{ fontWeight: 600 }}>{fmt(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {goals.length > 0 && <GoalProgressMini goals={goals} />}
    </div>
  );
};
