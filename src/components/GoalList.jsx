import { useState } from "react";
import { Box, Typography, LinearProgress, Button, IconButton, Alert } from "@mui/material";
import { CurrencyField } from "./ui/CurrencyField";
import { Pencil, Trash2, PiggyBank, Plus, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/Card";
import { GoalForm } from "./GoalForm";
import { fmt, computeGoalProgress } from "../utils/finance";
import { DEFAULT_GOAL } from "../constants";

const GoalCard = ({ goal, onEdit, onDelete, onAddSavings }) => {
  const [savingsInput, setSavingsInput] = useState("");
  const { pct, remaining, isComplete, monthsLeft, monthlyNeeded } = computeGoalProgress(goal);

  const handleAdd = () => {
    onAddSavings(goal.id, savingsInput);
    setSavingsInput("");
  };

  return (
    <Card sx={{ border: isComplete ? `2px solid #10b981` : "2px solid transparent" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Box sx={{
            width: 46, height: 46, borderRadius: 3,
            background: goal.color + "20",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
          }}>
            {goal.icon}
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography fontWeight={700} fontSize={15}>{goal.title}</Typography>
              {isComplete && <CheckCircle2 size={16} color="#10b981" />}
            </Box>
            {goal.deadline && (
              <Typography variant="caption" color="text.secondary">
                Prazo: {new Date(goal.deadline + "-01").toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                {monthsLeft !== null && ` · ${monthsLeft} meses restantes`}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size="small" onClick={() => onEdit(goal)} sx={{ background: "#e0e7ff", borderRadius: 2, "&:hover": { background: "#c7d2fe" } }}>
            <Pencil size={14} color="#6366f1" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(goal.id)} sx={{ background: "#fee2e2", borderRadius: 2, "&:hover": { background: "#fecaca" } }}>
            <Trash2 size={14} color="#dc2626" />
          </IconButton>
        </Box>
      </Box>

      {/* Barra de progresso */}
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
          <Typography variant="caption" color="text.secondary">Progresso</Typography>
          <Typography variant="caption" fontWeight={700} sx={{ color: goal.color }}>{pct.toFixed(0)}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 10, borderRadius: 5,
            backgroundColor: "#f1f5f9",
            "& .MuiLinearProgress-bar": {
              background: isComplete ? "#10b981" : goal.color,
              borderRadius: 5,
            },
          }}
        />
      </Box>

      {/* Valores */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, mb: 1.5 }}>
        {[["Meta", fmt(goal.target), "#1e293b"], ["Guardado", fmt(goal.saved), "#16a34a"], ["Faltam", fmt(Math.max(remaining, 0)), remaining > 0 ? "#dc2626" : "#16a34a"]].map(([l, v, c]) => (
          <Box key={l} sx={{ background: "#f8fafc", borderRadius: 2, p: "8px 10px", textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary" display="block">{l}</Typography>
            <Typography fontWeight={700} fontSize={13} sx={{ color: c, mt: 0.25 }}>{v}</Typography>
          </Box>
        ))}
      </Box>

      {/* Dica mensal */}
      {monthlyNeeded && !isComplete && (
        <Alert severity="info" sx={{ mb: 1.5, py: 0.25, fontSize: 12, borderRadius: 2 }} icon={false}>
          Guardando <strong>{fmt(monthlyNeeded)}/mes</strong> voces atingem a meta no prazo!
        </Alert>
      )}

      {/* Notas */}
      {goal.notes && (
        <Typography variant="caption" sx={{ display: "block", p: "6px 10px", background: "#fafafa", borderRadius: 2, mb: 1.5, color: "text.secondary" }}>
          {goal.notes}
        </Typography>
      )}

      {/* Acao */}
      {isComplete ? (
        <Box sx={{ textAlign: "center", p: 1.25, background: "#dcfce7", borderRadius: 2, color: "#16a34a", fontWeight: 700, fontSize: 14 }}>
          Meta alcancada! Parabens, Nicolas e Nicole!
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 1 }}>
          <CurrencyField
            label="Valor a guardar"
            value={savingsInput}
            onChange={e => setSavingsInput(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            startIcon={<PiggyBank size={15} />}
            sx={{ background: goal.color, "&:hover": { background: goal.color, filter: "brightness(0.9)" }, flexShrink: 0 }}
          >
            Guardar
          </Button>
        </Box>
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

  const handleCancel = () => { setShowForm(false); setEditId(null); setForm(DEFAULT_GOAL); };

  const handleSubmit = async () => {
    if (!form.title || !form.target) return;
    await onSave(form, editId);
    handleCancel();
  };

  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {!showForm && (
        <Button
          variant="outlined"
          startIcon={<Plus size={16} />}
          onClick={() => { setShowForm(true); setEditId(null); setForm(DEFAULT_GOAL); }}
          sx={{ borderStyle: "dashed", borderRadius: 3, py: 1.5, fontWeight: 700, fontSize: 14 }}
        >
          Nova Meta do Casal
        </Button>
      )}

      {showForm && (
        <GoalForm form={form} editId={editId} onChange={handleChange} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}

      {goals.length === 0 && !showForm && (
        <Card>
          <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
            <Typography fontSize={40}>🎯</Typography>
            <Typography>Nenhuma meta ainda. Criem a primeira juntos!</Typography>
          </Box>
        </Card>
      )}

      {goals.map(g => (
        <GoalCard key={g.id} goal={g} onEdit={handleEdit} onDelete={onDelete} onAddSavings={onAddSavings} />
      ))}
    </Box>
  );
};
