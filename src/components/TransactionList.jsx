import { Box, Chip, Divider, IconButton, Typography } from "@mui/material";
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./ui/Card";
import { PEOPLE, COLORS_PERSON } from "../constants";
import { fmt, parseDate } from "../utils/finance";

const FilterBar = ({ filterPerson, filterType, onPersonChange, onTypeChange }) => (
  <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
    {["Todos", ...PEOPLE].map(p => (
      <Chip
        key={p}
        label={p}
        onClick={() => onPersonChange(p)}
        color={filterPerson === p ? "primary" : "default"}
        variant={filterPerson === p ? "filled" : "outlined"}
        size="small"
      />
    ))}
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
    {[["Todos", "Todos"], ["income", "Entradas"], ["expense", "Saidas"]].map(([v, l]) => (
      <Chip
        key={v}
        label={l}
        onClick={() => onTypeChange(v)}
        color={filterType === v ? "primary" : "default"}
        variant={filterType === v ? "filled" : "outlined"}
        size="small"
      />
    ))}
  </Box>
);

const TransactionItem = ({ tx, onEdit, onDelete }) => {
  const pi = PEOPLE.indexOf(tx.person);
  const isIncome = tx.type === "income";

  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 1.5,
      p: "10px 12px", borderRadius: 3,
      background: "#f8fafc", border: "1px solid #f1f5f9",
      transition: "box-shadow .15s",
      "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
    }}>
      <Box sx={{
        width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
        background: isIncome ? "#dcfce7" : "#fee2e2",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {isIncome
          ? <TrendingUp size={18} color="#16a34a" />
          : <TrendingDown size={18} color="#dc2626" />}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontWeight={600} fontSize={14} noWrap>{tx.desc}</Typography>
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">{tx.category}</Typography>
          <Typography variant="caption" color="text.secondary">·</Typography>
          <Typography variant="caption" fontWeight={600} sx={{ color: COLORS_PERSON[pi] }}>{tx.person}</Typography>
          <Typography variant="caption" color="text.secondary">·</Typography>
          <Typography variant="caption" color="text.secondary">{parseDate(tx.date).toLocaleDateString("pt-BR")}</Typography>
        </Box>
      </Box>

      <Typography fontWeight={700} fontSize={14} color={isIncome ? "#16a34a" : "#dc2626"} sx={{ flexShrink: 0 }}>
        {isIncome ? "+" : "-"}{fmt(tx.amount)}
      </Typography>

      <Box sx={{ display: "flex", gap: 0.5 }}>
        <IconButton size="small" onClick={() => onEdit(tx)} sx={{ background: "#e0e7ff", borderRadius: 2, "&:hover": { background: "#c7d2fe" } }}>
          <Pencil size={14} color="#6366f1" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(tx.id)} sx={{ background: "#fee2e2", borderRadius: 2, "&:hover": { background: "#fecaca" } }}>
          <Trash2 size={14} color="#dc2626" />
        </IconButton>
      </Box>
    </Box>
  );
};

export const TransactionList = ({ transactions, filterPerson, filterType, onPersonChange, onTypeChange, onEdit, onDelete }) => {
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Card>
      <FilterBar
        filterPerson={filterPerson} filterType={filterType}
        onPersonChange={onPersonChange} onTypeChange={onTypeChange}
      />
      {sorted.length === 0
        ? <Typography color="text.secondary" textAlign="center" py={4}>Nenhum lancamento encontrado.</Typography>
        : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {sorted.map(t => (
              <TransactionItem key={t.id} tx={t} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </Box>
        )
      }
    </Card>
  );
};
