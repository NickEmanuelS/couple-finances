import { useState, useMemo } from "react";
import { useTransactions } from "./hooks/useTransactions";
import { useGoals } from "./hooks/useGoals";
import { computeStats } from "./utils/finance";
import { DEFAULT_TRANSACTION } from "./constants";
import { Header } from "./components/Header";
import { TabBar } from "./components/ui/TabBar";
import { Dashboard } from "./components/Dashboard";
import { TransactionList } from "./components/TransactionList";
import { TransactionForm } from "./components/TransactionForm";
import { GoalList } from "./components/GoalList";

const now = new Date();

export default function App() {
  const { loading, getMonthTxs, save: saveTx, remove: deleteTx, buildUpdatedForm } = useTransactions();
  const { goals, save: saveGoal, addSavings, remove: deleteGoal } = useGoals();

  const [form, setForm] = useState(DEFAULT_TRANSACTION);
  const [editId, setEditId] = useState(null);
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [tab, setTab] = useState("dashboard");
  const [filterPerson, setFilterPerson] = useState("Todos");
  const [filterType, setFilterType] = useState("Todos");

  const monthTxs = useMemo(() => getMonthTxs(month, year), [getMonthTxs, month, year]);
  const stats = useMemo(() => computeStats(monthTxs), [monthTxs]);
  const filtered = useMemo(() => monthTxs.filter(t =>
    (filterPerson === "Todos" || t.person === filterPerson) &&
    (filterType === "Todos" || t.type === filterType)
  ), [monthTxs, filterPerson, filterType]);

  const handleTabSelect = (id) => {
    setTab(id);
    if (id !== "add") { setEditId(null); setForm(DEFAULT_TRANSACTION); }
  };

  const handleEditTx = (tx) => {
    setForm({ desc: tx.desc, amount: tx.amount, type: tx.type, category: tx.category, person: tx.person, date: tx.date });
    setEditId(tx.id);
    setTab("add");
  };

  const handleDeleteTx = (id) => {
    if (confirm("Excluir este lancamento?")) deleteTx(id);
  };

  const handleSubmitTx = async () => {
    if (!form.desc || !form.amount || isNaN(parseFloat(form.amount))) return;
    await saveTx(form, editId);
    setEditId(null);
    setForm({ ...DEFAULT_TRANSACTION, type: form.type, person: form.person });
    setTab("transactions");
  };

  const handleCancelTx = () => {
    setEditId(null);
    setForm(DEFAULT_TRANSACTION);
    setTab("transactions");
  };

  const handleFormChange = (key, value) => setForm(f => buildUpdatedForm(f, key, value));

  const handleDeleteGoal = (id) => {
    if (confirm("Excluir esta meta?")) deleteGoal(id);
  };

  const handleAddSavings = (goalId, amount) => addSavings(goalId, amount, goals);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif", color: "#6366f1", flexDirection: "column", gap: 12 }}>
      <p style={{ fontWeight: 700 }}>Carregando dados...</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        <Header
          month={month} year={year}
          onMonthChange={setMonth} onYearChange={setYear}
          stats={stats}
        />

        <TabBar activeTab={tab} onSelect={handleTabSelect} hasEdit={!!editId} />

        {tab === "dashboard" && (
          <Dashboard stats={stats} goals={goals} monthTxs={monthTxs} month={month} year={year} />
        )}

        {tab === "transactions" && (
          <TransactionList
            transactions={filtered}
            filterPerson={filterPerson} filterType={filterType}
            onPersonChange={setFilterPerson} onTypeChange={setFilterType}
            onEdit={handleEditTx} onDelete={handleDeleteTx}
          />
        )}

        {tab === "goals" && (
          <GoalList
            goals={goals}
            onSave={saveGoal}
            onDelete={handleDeleteGoal}
            onAddSavings={handleAddSavings}
          />
        )}

        {tab === "add" && (
          <TransactionForm
            form={form} editId={editId}
            onChange={handleFormChange}
            onSubmit={handleSubmitTx}
            onCancel={handleCancelTx}
          />
        )}

      </div>
    </div>
  );
}
