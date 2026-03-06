import {
  Box, Typography, ToggleButtonGroup, ToggleButton,
  TextField, MenuItem, Button, Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { TrendingDown, TrendingUp } from "lucide-react";
import dayjs from "dayjs";
import { Card } from "./ui/Card";
import { CurrencyField } from "./ui/CurrencyField";
import { PEOPLE, COLORS_PERSON, CATEGORIES } from "../constants";

export const TransactionForm = ({ form, editId, onChange, onSubmit, onCancel }) => {
  const set = (key, value) => onChange(key, value);

  return (
    <Card>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        {editId ? "Editar Lancamento" : "Novo Lancamento"}
      </Typography>

      <Stack spacing={2}>
        {/* Tipo */}
        <ToggleButtonGroup
          exclusive fullWidth
          value={form.type}
          onChange={(_, v) => v && set("type", v)}
          sx={{ gap: 1 }}
        >
          <ToggleButton value="expense" sx={{
            borderRadius: "12px !important", fontWeight: 700, gap: 1, flex: 1,
            "&.Mui-selected": { background: "#fee2e2", color: "#dc2626", borderColor: "#dc2626" },
          }}>
            <TrendingDown size={16} /> Saida
          </ToggleButton>
          <ToggleButton value="income" sx={{
            borderRadius: "12px !important", fontWeight: 700, gap: 1, flex: 1,
            "&.Mui-selected": { background: "#dcfce7", color: "#16a34a", borderColor: "#16a34a" },
          }}>
            <TrendingUp size={16} /> Entrada
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Pessoa */}
        <ToggleButtonGroup
          exclusive fullWidth
          value={form.person}
          onChange={(_, v) => v && set("person", v)}
          sx={{ gap: 1 }}
        >
          {PEOPLE.map((p, i) => (
            <ToggleButton key={p} value={p} sx={{
              borderRadius: "12px !important", fontWeight: 700, flex: 1,
              "&.Mui-selected": {
                background: COLORS_PERSON[i] + "18",
                color: COLORS_PERSON[i],
                borderColor: COLORS_PERSON[i],
              },
            }}>
              {i === 0 ? "👦" : "👧"} {p}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Descricao */}
        <TextField
          label="Descricao"
          value={form.desc}
          onChange={e => set("desc", e.target.value)}
          placeholder="Ex: Supermercado, Salario..."
        />

        {/* Valor + Data */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          <CurrencyField
            label="Valor"
            value={form.amount}
            onChange={e => set("amount", e.target.value)}
          />
          <DatePicker
            label="Data"
            value={form.date ? dayjs(form.date) : null}
            onChange={d => set("date", d ? d.format("YYYY-MM-DD") : "")}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
            format="DD/MM/YYYY"
          />
        </Box>

        {/* Categoria */}
        <TextField
          select
          label="Categoria"
          value={form.category}
          onChange={e => set("category", e.target.value)}
        >
          {CATEGORIES[form.type].map(c => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>

        {/* Botoes */}
        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
          {editId && (
            <Button variant="outlined" color="inherit" onClick={onCancel} sx={{ flex: 1 }}>
              Cancelar
            </Button>
          )}
          <Button variant="contained" color="primary" onClick={onSubmit} sx={{ flex: 2, py: 1.2 }}>
            {editId ? "Salvar Alteracoes" : "Adicionar Lancamento"}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};
