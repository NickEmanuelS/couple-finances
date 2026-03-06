import { Box, Typography, TextField, Button, Stack, Tooltip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Card } from "./ui/Card";
import { CurrencyField } from "./ui/CurrencyField";
import { GOAL_ICONS, GOAL_COLORS } from "../constants";

export const GoalForm = ({ form, editId, onChange, onSubmit, onCancel }) => {
  const set = (key, value) => onChange(key, value);

  return (
    <Card>
      <Typography variant="subtitle1" fontWeight={700} mb={2}>
        {editId ? "Editar Meta" : "Nova Meta"}
      </Typography>

      <Stack spacing={2}>
        {/* Icones */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>Icone</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.75 }}>
            {GOAL_ICONS.map(ic => (
              <Tooltip key={ic} title={ic} placement="top">
                <Box
                  component="button"
                  onClick={() => set("icon", ic)}
                  sx={{
                    width: 38, height: 38, borderRadius: 2, fontSize: 20, cursor: "pointer",
                    border: `2px solid ${form.icon === ic ? "#6366f1" : "#e2e8f0"}`,
                    background: form.icon === ic ? "#eef2ff" : "white",
                    transition: "all .15s",
                    "&:hover": { borderColor: "#6366f1", background: "#eef2ff" },
                  }}
                >
                  {ic}
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Nome */}
        <TextField
          label="Nome da Meta"
          value={form.title}
          onChange={e => set("title", e.target.value)}
          placeholder="Ex: Viagem para Europa"
        />

        {/* Valores */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          <CurrencyField
            label="Valor Total"
            value={form.target}
            onChange={e => set("target", e.target.value)}
          />
          <CurrencyField
            label="Ja guardado"
            value={form.saved}
            onChange={e => set("saved", e.target.value)}
          />
        </Box>

        {/* Prazo + Cor */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, alignItems: "start" }}>
          <DatePicker
            label="Prazo"
            views={["month", "year"]}
            value={form.deadline ? dayjs(form.deadline + "-01") : null}
            onChange={d => set("deadline", d ? d.format("YYYY-MM") : "")}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
            format="MM/YYYY"
          />
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>Cor</Typography>
            <Box sx={{ display: "flex", gap: 0.75, mt: 1.25 }}>
              {GOAL_COLORS.map(c => (
                <Box
                  key={c}
                  component="button"
                  onClick={() => set("color", c)}
                  sx={{
                    width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer",
                    border: `3px solid ${form.color === c ? "#1e293b" : "transparent"}`,
                    transition: "transform .15s",
                    "&:hover": { transform: "scale(1.15)" },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Observacoes */}
        <TextField
          label="Observacoes"
          value={form.notes}
          onChange={e => set("notes", e.target.value)}
          placeholder="Notas sobre a meta..."
        />

        {/* Botoes */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={onCancel} sx={{ flex: 1 }}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={onSubmit} sx={{ flex: 2, py: 1.2 }}>
            {editId ? "Salvar" : "Criar Meta"}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};
