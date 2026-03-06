import { useState } from "react";
import { Card } from "./ui/Card";
import { GoalForm } from "./GoalForm";
import { fmt } from "../utils/finance";
import { computeGoalProgress } from "../utils/finance";
import { DEFAULT_GOAL } from "../constants";

const GoalCard = ({ goal, onEdit, onDelete, onAddSavings }) => {
  const [savingsInput, setSavingsInput] = useState("");
  const { pct, remaining, isComplete, monthsLeft, monthlyNeeded } = computeGoalProgress(goal);

  const handleAdd = () => {
    onAddSavings(goal.id, savingsInput);
    setSavingsInput("");
  };

  return (
    <Card style={{ border: isComplete ? "2px solid #10b981" : "2px solid transparent" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: goal.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            {goal.icon}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{goal.title} {isComplete && "✅"}</div>
            {goal.deadline && (
              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                Prazo: {new Date(goal.deadline + "-01").toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                {monthsLeft !== null && ` · ${monthsLeft} meses restantes`}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => onEdit(goal)} style={{ background: "#e0e7ff", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer" }}>✏️</button>
          <button onClick={() => onDelete(goal.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer" }}>🗑️</button>
        </div>
      </div>

      <div style={{ margin: "14px 0 6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: "#64748b" }}>Progresso</span>
          <span style={{ fontWeight: 700, color: goal.color }}>{pct.toFixed(0)}%</span>
        </div>
        <div style={{ background: "#f1f5f9", borderRadius: 99, height: 12, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: isComplete ? "#10b981" : goal.color, borderRadius: 99, transition: "width .4s" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, margin: "12px 0" }}>
        {[["Meta", fmt(goal.target), "#1e293b"], ["Guardado", fmt(goal.saved), "#16a34a"], ["Faltam", fmt(Math.max(remaining, 0)), remaining > 0 ? "#dc2626" : "#16a34a"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#f8fafc", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{l}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: c, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>

      {monthlyNeeded && !isComplete && (
        <div style={{ background: "#eff6ff", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#3b82f6", marginBottom: 10 }}>
          Guardando <strong>{fmt(monthlyNeeded)}/mes</strong> voces atingem a meta no prazo!
        </div>
      )}

      {goal.notes && (
        <div style={{ fontSize: 12, color: "#64748b", padding: "6px 10px", background: "#fafafa", borderRadius: 8, marginBottom: 10 }}>
          {goal.notes}
        </div>
      )}

      {isComplete ? (
        <div style={{ textAlign: "center", padding: 10, background: "#dcfce7", borderRadius: 10, color: "#16a34a", fontWeight: 700 }}>
          Meta alcancada! Parabens, Nicolas e Nicole!
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            placeholder="Adicionar valor guardado..."
            value={savingsInput}
            onChange={e => setSavingsInput(e.target.value)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, outline: "none" }}
          />
          <button onClick={handleAdd}
            style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: goal.color, color: "white", fontWeight: 700, cursor: "pointer" }}>
            + Guardar
          </button>
        </div>
      )}
    </Card>
  );
};

export const GoalList = ({ goals, onSave, onDelete, onAddSavings }) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(DEFAULT_GOAL);

  const handleEdit = (goal) => {
    setForm({ title: goal.title, target: goal.target, saved: goal.saved, icon: goal.icon, deadline: goal.deadline || "", color: goal.color, notes: goal.notes || "" });
    setEditId(goal.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setForm(DEFAULT_GOAL);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.target) return;
    await onSave(form, editId);
    handleCancel();
  };

  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {!showForm && (
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(DEFAULT_GOAL); }}
          style={{ padding: 12, borderRadius: 14, border: "2px dashed #a5b4fc", background: "#eef2ff", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#6366f1" }}>
          Nova Meta do Casal
        </button>
      )}

      {showForm && (
        <GoalForm
          form={form}
          editId={editId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {goals.length === 0 && !showForm && (
        <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", background: "white", borderRadius: 16 }}>
          <p style={{ fontSize: 40, margin: 0 }}>🎯</p>
          <p>Nenhuma meta ainda. Criem a primeira juntos!</p>
        </div>
      )}

      {goals.map(g => (
        <GoalCard
          key={g.id}
          goal={g}
          onEdit={handleEdit}
          onDelete={onDelete}
          onAddSavings={onAddSavings}
        />
      ))}
    </div>
  );
};
