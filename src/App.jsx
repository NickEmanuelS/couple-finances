import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy
} from "firebase/firestore";
import { db } from "./firebase";

const PEOPLE = ["Nicolas", "Nicole"];
const COLORS_PERSON = ["#6366f1", "#ec4899"];
const CATEGORIES = {
  income: ["Salário", "Freelance", "Investimentos", "13º Salário", "Bônus", "Aluguel Recebido", "Presente", "Reembolso", "Venda", "Outro"],
  expense: ["Alimentação", "Moradia", "Aluguel", "Condomínio", "Água/Luz/Gás", "Internet/Telefone", "Transporte", "Combustível", "Uber/Táxi", "Saúde", "Farmácia", "Academia", "Lazer", "Viagem", "Restaurante", "Streaming", "Vestuário", "Educação", "Pets", "Presentes", "Casal", "Supermercado", "Parcela/Financiamento", "Assinaturas", "Outro"],
};
const CAT_COLORS = ["#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#8b5cf6","#ef4444","#14b8a6","#f97316","#64748b","#a855f7","#06b6d4","#84cc16","#fb923c","#e11d48"];
const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const GOAL_ICONS = ["🏠","✈️","💍","🚗","💻","📱","🎓","🏖️","💰","🛋️","👶","🐾","🎉","🏋️","⚕️","🎯"];

const fmt = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const now = new Date();
const defaultForm = { desc: "", amount: "", type: "expense", category: "Alimentação", person: "Nicolas", date: new Date().toISOString().split("T")[0] };
const defaultGoal = { title: "", target: "", saved: "", icon: "🎯", deadline: "", color: "#6366f1", notes: "" };

const Card = ({ children, style = {} }) => <div style={{ background: "white", borderRadius: 16, padding: 16, ...style }}>{children}</div>;
const SectionTitle = ({ t }) => <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#475569" }}>{t}</h3>;
const TabBtn = ({ id, label, activeTab, setTab, setEditId }) => (
  <button onClick={() => { setTab(id); if (id !== "add") setEditId(null); }}
    style={{ padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
      background: activeTab === id ? "#6366f1" : "transparent", color: activeTab === id ? "white" : "#64748b" }}>
    {label}
  </button>
);

export default function App() {
  const [txs, setTxs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(defaultForm);
  const [goalForm, setGoalForm] = useState(defaultGoal);
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [tab, setTab] = useState("dashboard");
  const [editId, setEditId] = useState(null);
  const [editGoalId, setEditGoalId] = useState(null);
  const [filterPerson, setFilterPerson] = useState("Todos");
  const [filterType, setFilterType] = useState("Todos");
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [addGoalSavings, setAddGoalSavings] = useState({ id: null, val: "" });

  // Realtime listener — transactions
  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, snap => {
      setTxs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  // Realtime listener — goals
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "goals"), snap => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const monthTxs = useMemo(() => txs.filter(t => {
    const d = new Date(t.date + "T12:00:00");
    return d.getMonth() === month && d.getFullYear() === year;
  }), [txs, month, year]);

  const filtered = useMemo(() => monthTxs.filter(t =>
    (filterPerson === "Todos" || t.person === filterPerson) &&
    (filterType === "Todos" || t.type === filterType)
  ), [monthTxs, filterPerson, filterType]);

  const stats = useMemo(() => {
    const byPerson = PEOPLE.map(p => {
      const inc = monthTxs.filter(t => t.person === p && t.type === "income").reduce((a, t) => a + t.amount, 0);
      const exp = monthTxs.filter(t => t.person === p && t.type === "expense").reduce((a, t) => a + t.amount, 0);
      return { name: p, income: inc, expense: exp, balance: inc - exp };
    });
    const totalInc = byPerson.reduce((a, p) => a + p.income, 0);
    const totalExp = byPerson.reduce((a, p) => a + p.expense, 0);
    const byCat = {};
    monthTxs.filter(t => t.type === "expense").forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
    const catData = Object.entries(byCat).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    return { byPerson, totalInc, totalExp, totalBalance: totalInc - totalExp, catData };
  }, [monthTxs]);

  // ── TRANSACTIONS CRUD ──
  const handleSubmit = async () => {
    if (!form.desc || !form.amount || isNaN(parseFloat(form.amount))) return;
    const data = { ...form, amount: parseFloat(form.amount) };
    if (editId) {
      await updateDoc(doc(db, "transactions", editId), data);
      setEditId(null);
    } else {
      await addDoc(collection(db, "transactions"), data);
    }
    setForm({ ...defaultForm, type: form.type, person: form.person });
    setTab("transactions");
  };

  const handleEdit = tx => {
    setForm({ desc: tx.desc, amount: tx.amount, type: tx.type, category: tx.category, person: tx.person, date: tx.date });
    setEditId(tx.id);
    setTab("add");
  };

  const handleDelete = async id => {
    if (confirm("Excluir este lançamento?")) await deleteDoc(doc(db, "transactions", id));
  };

  const setField = (k, v) => {
    const u = { ...form, [k]: v };
    if (k === "type") u.category = CATEGORIES[v][0];
    setForm(u);
  };

  // ── GOALS CRUD ──
  const handleGoalSubmit = async () => {
    if (!goalForm.title || !goalForm.target) return;
    const data = { ...goalForm, target: parseFloat(goalForm.target), saved: parseFloat(goalForm.saved || 0) };
    if (editGoalId) {
      await updateDoc(doc(db, "goals", editGoalId), data);
      setEditGoalId(null);
    } else {
      await addDoc(collection(db, "goals"), data);
    }
    setGoalForm(defaultGoal);
    setShowGoalForm(false);
  };

  const handleAddSavings = async gid => {
    const val = parseFloat(addGoalSavings.val);
    if (!val || isNaN(val)) return;
    const g = goals.find(g => g.id === gid);
    await updateDoc(doc(db, "goals", gid), { saved: Math.min(g.saved + val, g.target) });
    setAddGoalSavings({ id: null, val: "" });
  };

  const handleDeleteGoal = async id => {
    if (confirm("Excluir esta meta?")) await deleteDoc(doc(db, "goals", id));
  };


  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif", color: "#6366f1", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 48 }}>💑</div>
      <p style={{ fontWeight: 700 }}>Carregando dados...</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)", borderRadius: 20, padding: "20px 24px", marginBottom: 16, color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>💑 Nicolas & Nicole</h1>
              <p style={{ margin: "4px 0 0", opacity: 0.85, fontSize: 13 }}>Controle financeiro do casal</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select value={month} onChange={e => setMonth(+e.target.value)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 10, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}>
                {MONTHS.map((m, i) => <option key={i} value={i} style={{ color: "#000" }}>{m}</option>)}
              </select>
              <select value={year} onChange={e => setYear(+e.target.value)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 10, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}>
                {[2023,2024,2025,2026,2027].map(y => <option key={y} value={y} style={{ color: "#000" }}>{y}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16 }}>
            {[
              { label: "💚 Entradas", value: stats.totalInc },
              { label: "❤️ Saídas", value: stats.totalExp },
              { label: "⚖️ Saldo", value: stats.totalBalance },
            ].map(c => (
              <div key={c.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px" }}>
                <p style={{ margin: 0, fontSize: 11, opacity: 0.85 }}>{c.label}</p>
                <p style={{ margin: "2px 0 0", fontWeight: 700, fontSize: 15 }}>{fmt(c.value)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div style={{ background: "white", borderRadius: 16, padding: "6px 10px", marginBottom: 16, display: "flex", gap: 2, overflowX: "auto" }}>
          <TabBtn id="dashboard" label="📊 Dashboard" activeTab={tab} setTab={setTab} setEditId={setEditId} />
          <TabBtn id="transactions" label="📋 Lançamentos" activeTab={tab} setTab={setTab} setEditId={setEditId} />
          <TabBtn id="goals" label="🎯 Metas" activeTab={tab} setTab={setTab} setEditId={setEditId} />
          <TabBtn id="add" label={editId ? "✏️ Editar" : "➕ Adicionar"} activeTab={tab} setTab={setTab} setEditId={setEditId} />
        </div>

        {/* ───── DASHBOARD ───── */}
        {tab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {stats.byPerson.map((p, i) => (
                <Card key={p.name}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS_PERSON[i] + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      {i === 0 ? "👦" : "👧"}
                    </div>
                    <span style={{ fontWeight: 700, color: COLORS_PERSON[i] }}>{p.name}</span>
                  </div>
                  {[["Entradas", p.income, "#16a34a"], ["Saídas", p.expense, "#dc2626"], ["Saldo", p.balance, p.balance >= 0 ? "#16a34a" : "#dc2626"]].map(([l, v, c]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0", borderBottom: l === "Saídas" ? "1px solid #f1f5f9" : "none" }}>
                      <span style={{ color: "#64748b" }}>{l}</span>
                      <span style={{ fontWeight: l === "Saldo" ? 700 : 600, color: c }}>{fmt(v)}</span>
                    </div>
                  ))}
                </Card>
              ))}
            </div>

            <Card>
              <SectionTitle t="Comparativo por Pessoa" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.byPerson}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${(v/1000).toFixed(1)}k`} />
                  <Tooltip formatter={v => fmt(v)} />
                  <Legend />
                  <Bar dataKey="income" name="Entradas" fill="#10b981" radius={[6,6,0,0]} />
                  <Bar dataKey="expense" name="Saídas" fill="#f87171" radius={[6,6,0,0]} />
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

            {goals.length > 0 && (
              <Card>
                <SectionTitle t="🎯 Progresso das Metas" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {goals.map(g => {
                    const pct = Math.min((g.saved / g.target) * 100, 100);
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
            )}

            {monthTxs.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", background: "white", borderRadius: 16 }}>
                <p style={{ fontSize: 40, margin: 0 }}>📭</p>
                <p>Nenhum lançamento em {MONTHS[month]}/{year}.</p>
              </div>
            )}
          </div>
        )}

        {/* ───── LANÇAMENTOS ───── */}
        {tab === "transactions" && (
          <Card>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {["Todos", ...PEOPLE].map(p => (
                <button key={p} onClick={() => setFilterPerson(p)}
                  style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    background: filterPerson === p ? "#6366f1" : "#f1f5f9", color: filterPerson === p ? "white" : "#64748b" }}>
                  {p}
                </button>
              ))}
              <div style={{ width: 1, background: "#e2e8f0", margin: "0 2px" }} />
              {[["Todos","Todos"],["income","💰 Entradas"],["expense","💸 Saídas"]].map(([v, l]) => (
                <button key={v} onClick={() => setFilterType(v)}
                  style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                    background: filterType === v ? "#6366f1" : "#f1f5f9", color: filterType === v ? "white" : "#64748b" }}>
                  {l}
                </button>
              ))}
            </div>
            {filtered.length === 0
              ? <p style={{ textAlign: "center", color: "#94a3b8", padding: 30 }}>Nenhum lançamento encontrado.</p>
              : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => {
                    const pi = PEOPLE.indexOf(t.person);
                    return (
                      <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.type === "income" ? "#dcfce7" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                          {t.type === "income" ? "💰" : "💸"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.desc}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", gap: 4 }}>
                            <span>{t.category}</span><span>·</span>
                            <span style={{ color: COLORS_PERSON[pi], fontWeight: 600 }}>{t.person}</span><span>·</span>
                            <span>{new Date(t.date + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: t.type === "income" ? "#16a34a" : "#dc2626", flexShrink: 0 }}>
                          {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => handleEdit(t)} style={{ background: "#e0e7ff", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer" }}>✏️</button>
                          <button onClick={() => handleDelete(t.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer" }}>🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
            }
          </Card>
        )}

        {/* ───── METAS ───── */}
        {tab === "goals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!showGoalForm && (
              <button onClick={() => { setShowGoalForm(true); setEditGoalId(null); setGoalForm(defaultGoal); }}
                style={{ padding: 12, borderRadius: 14, border: "2px dashed #a5b4fc", background: "#eef2ff", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#6366f1" }}>
                ✨ Nova Meta do Casal
              </button>
            )}

            {showGoalForm && (
              <Card>
                <SectionTitle t={editGoalId ? "✏️ Editar Meta" : "✨ Nova Meta"} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Ícone</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                      {GOAL_ICONS.map(ic => (
                        <button key={ic} onClick={() => setGoalForm(f => ({ ...f, icon: ic }))}
                          style={{ width: 36, height: 36, borderRadius: 10, border: `2px solid ${goalForm.icon === ic ? "#6366f1" : "#e2e8f0"}`, background: goalForm.icon === ic ? "#eef2ff" : "white", cursor: "pointer", fontSize: 18 }}>
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Nome da Meta</label>
                    <input value={goalForm.title} onChange={e => setGoalForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Viagem para Europa"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Valor Total (R$)</label>
                      <input type="number" value={goalForm.target} onChange={e => setGoalForm(f => ({ ...f, target: e.target.value }))} placeholder="0,00"
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Já guardado (R$)</label>
                      <input type="number" value={goalForm.saved} onChange={e => setGoalForm(f => ({ ...f, saved: e.target.value }))} placeholder="0,00"
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none" }} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Prazo</label>
                      <input type="month" value={goalForm.deadline} onChange={e => setGoalForm(f => ({ ...f, deadline: e.target.value }))}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Cor</label>
                      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                        {["#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444"].map(c => (
                          <button key={c} onClick={() => setGoalForm(f => ({ ...f, color: c }))}
                            style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: `3px solid ${goalForm.color === c ? "#1e293b" : "transparent"}`, cursor: "pointer" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Observações</label>
                    <input value={goalForm.notes} onChange={e => setGoalForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notas sobre a meta..."
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setShowGoalForm(false); setEditGoalId(null); }}
                      style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontWeight: 600, color: "#64748b" }}>
                      Cancelar
                    </button>
                    <button onClick={handleGoalSubmit}
                      style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "white" }}>
                      {editGoalId ? "Salvar" : "Criar Meta"}
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {goals.length === 0 && !showGoalForm && (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", background: "white", borderRadius: 16 }}>
                <p style={{ fontSize: 40, margin: 0 }}>🎯</p>
                <p>Nenhuma meta ainda. Criem a primeira juntos!</p>
              </div>
            )}

            {goals.map(g => {
              const pct = Math.min((g.saved / g.target) * 100, 100);
              const remaining = g.target - g.saved;
              const isComplete = pct >= 100;
              const deadline = g.deadline ? new Date(g.deadline + "-01") : null;
              const monthsLeft = deadline ? Math.max(0, (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth())) : null;
              const monthlyNeeded = monthsLeft > 0 ? remaining / monthsLeft : null;

              return (
                <Card key={g.id} style={{ border: isComplete ? "2px solid #10b981" : "2px solid transparent" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: g.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{g.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{g.title} {isComplete && "✅"}</div>
                        {g.deadline && <div style={{ fontSize: 11, color: "#94a3b8" }}>Prazo: {new Date(g.deadline + "-01").toLocaleDateString("pt-BR", { month: "short", year: "numeric" })} {monthsLeft !== null && `· ${monthsLeft} meses restantes`}</div>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => { setGoalForm({ title: g.title, target: g.target, saved: g.saved, icon: g.icon, deadline: g.deadline || "", color: g.color, notes: g.notes || "" }); setEditGoalId(g.id); setShowGoalForm(true); }}
                        style={{ background: "#e0e7ff", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer" }}>✏️</button>
                      <button onClick={() => handleDeleteGoal(g.id)}
                        style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer" }}>🗑️</button>
                    </div>
                  </div>
                  <div style={{ margin: "14px 0 6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: "#64748b" }}>Progresso</span>
                      <span style={{ fontWeight: 700, color: g.color }}>{pct.toFixed(0)}%</span>
                    </div>
                    <div style={{ background: "#f1f5f9", borderRadius: 99, height: 12, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: isComplete ? "#10b981" : g.color, borderRadius: 99, transition: "width .4s" }} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, margin: "12px 0" }}>
                    {[["Meta", fmt(g.target), "#1e293b"], ["Guardado", fmt(g.saved), "#16a34a"], ["Faltam", fmt(Math.max(remaining, 0)), remaining > 0 ? "#dc2626" : "#16a34a"]].map(([l, v, c]) => (
                      <div key={l} style={{ background: "#f8fafc", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{l}</div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: c, marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {monthlyNeeded && !isComplete && (
                    <div style={{ background: "#eff6ff", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#3b82f6", marginBottom: 10 }}>
                      💡 Guardando <strong>{fmt(monthlyNeeded)}/mês</strong> vocês atingem a meta no prazo!
                    </div>
                  )}
                  {g.notes && <div style={{ fontSize: 12, color: "#64748b", padding: "6px 10px", background: "#fafafa", borderRadius: 8, marginBottom: 10 }}>📝 {g.notes}</div>}
                  {!isComplete ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="number" placeholder="Adicionar valor guardado..."
                        value={addGoalSavings.id === g.id ? addGoalSavings.val : ""}
                        onChange={e => setAddGoalSavings({ id: g.id, val: e.target.value })}
                        onFocus={() => setAddGoalSavings(a => ({ ...a, id: g.id }))}
                        style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, outline: "none" }} />
                      <button onClick={() => handleAddSavings(g.id)}
                        style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: g.color, color: "white", fontWeight: 700, cursor: "pointer" }}>
                        + Guardar
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: 10, background: "#dcfce7", borderRadius: 10, color: "#16a34a", fontWeight: 700 }}>
                      🎉 Meta alcançada! Parabéns, Nicolas e Nicole!
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ───── ADICIONAR / EDITAR ───── */}
        {tab === "add" && (
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>{editId ? "✏️ Editar Lançamento" : "➕ Novo Lançamento"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["expense","💸 Saída","#dc2626","#fee2e2"],["income","💰 Entrada","#16a34a","#dcfce7"]].map(([v,l,c,bg]) => (
                  <button key={v} onClick={() => setField("type", v)}
                    style={{ padding: 12, borderRadius: 12, border: `2px solid ${form.type === v ? c : "#e2e8f0"}`, cursor: "pointer", fontWeight: 700, fontSize: 14, background: form.type === v ? bg : "white", color: form.type === v ? c : "#94a3b8" }}>
                    {l}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {PEOPLE.map((p, i) => (
                  <button key={p} onClick={() => setField("person", p)}
                    style={{ padding: 12, borderRadius: 12, border: `2px solid ${form.person === p ? COLORS_PERSON[i] : "#e2e8f0"}`, cursor: "pointer", fontWeight: 700, fontSize: 14, background: form.person === p ? COLORS_PERSON[i] + "15" : "white", color: form.person === p ? COLORS_PERSON[i] : "#94a3b8" }}>
                    {i === 0 ? "👦" : "👧"} {p}
                  </button>
                ))}
              </div>
              {["desc","amount","date"].map(k => (
                <div key={k}>
                  <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                    {k === "desc" ? "Descrição" : k === "amount" ? "Valor (R$)" : "Data"}
                  </label>
                  <input value={form[k]} onChange={e => setField(k, e.target.value)}
                    type={k === "amount" ? "number" : k === "date" ? "date" : "text"}
                    placeholder={k === "desc" ? "Ex: Supermercado, Salário..." : k === "amount" ? "0,00" : ""}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Categoria</label>
                <select value={form.category} onChange={e => setField("category", e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", background: "white" }}>
                  {CATEGORIES[form.type].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                {editId && (
                  <button onClick={() => { setEditId(null); setForm(defaultForm); setTab("transactions"); }}
                    style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontWeight: 600, color: "#64748b" }}>
                    Cancelar
                  </button>
                )}
                <button onClick={handleSubmit}
                  style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "white" }}>
                  {editId ? "Salvar Alterações" : "Adicionar Lançamento"}
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}