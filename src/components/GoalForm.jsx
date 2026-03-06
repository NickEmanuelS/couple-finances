import { Card } from "./ui/Card";
import { SectionTitle } from "./ui/SectionTitle";
import { GOAL_ICONS, GOAL_COLORS } from "../constants";

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1px solid #e2e8f0", fontSize: 14, marginTop: 4,
  boxSizing: "border-box", outline: "none",
};

export const GoalForm = ({ form, editId, onChange, onSubmit, onCancel }) => {
  const set = (key, value) => onChange(key, value);

  return (
    <Card>
      <SectionTitle t={editId ? "Editar Meta" : "Nova Meta"} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Ícones */}
        <div>
          <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Icone</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {GOAL_ICONS.map(ic => (
              <button key={ic} onClick={() => set("icon", ic)}
                style={{
                  width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18,
                  border: `2px solid ${form.icon === ic ? "#6366f1" : "#e2e8f0"}`,
                  background: form.icon === ic ? "#eef2ff" : "white",
                }}>
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Nome */}
        <div>
          <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Nome da Meta</label>
          <input value={form.title} onChange={e => set("title", e.target.value)}
            placeholder="Ex: Viagem para Europa" style={inputStyle} />
        </div>

        {/* Valores */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Valor Total (R$)</label>
            <input type="number" value={form.target} onChange={e => set("target", e.target.value)}
              placeholder="0,00" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Ja guardado (R$)</label>
            <input type="number" value={form.saved} onChange={e => set("saved", e.target.value)}
              placeholder="0,00" style={inputStyle} />
          </div>
        </div>

        {/* Prazo e Cor */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Prazo</label>
            <input type="month" value={form.deadline} onChange={e => set("deadline", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Cor</label>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              {GOAL_COLORS.map(c => (
                <button key={c} onClick={() => set("color", c)}
                  style={{
                    width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer",
                    border: `3px solid ${form.color === c ? "#1e293b" : "transparent"}`,
                  }} />
              ))}
            </div>
          </div>
        </div>

        {/* Observações */}
        <div>
          <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Observacoes</label>
          <input value={form.notes} onChange={e => set("notes", e.target.value)}
            placeholder="Notas sobre a meta..." style={inputStyle} />
        </div>

        {/* Botões */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontWeight: 600, color: "#64748b" }}>
            Cancelar
          </button>
          <button onClick={onSubmit}
            style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "white" }}>
            {editId ? "Salvar" : "Criar Meta"}
          </button>
        </div>

      </div>
    </Card>
  );
};
