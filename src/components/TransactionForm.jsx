import { Card } from "./ui/Card";
import { PEOPLE, COLORS_PERSON, CATEGORIES } from "../constants";

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1px solid #e2e8f0", fontSize: 14, marginTop: 4,
  boxSizing: "border-box", outline: "none",
};

export const TransactionForm = ({ form, editId, onChange, onSubmit, onCancel }) => {
  const setField = (key, value) => onChange(key, value);

  return (
    <Card>
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>
        {editId ? "Editar Lancamento" : "Novo Lancamento"}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Tipo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["expense", "Saida", "#dc2626", "#fee2e2"], ["income", "Entrada", "#16a34a", "#dcfce7"]].map(([v, l, c, bg]) => (
            <button key={v} onClick={() => setField("type", v)}
              style={{
                padding: 12, borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14,
                border: `2px solid ${form.type === v ? c : "#e2e8f0"}`,
                background: form.type === v ? bg : "white",
                color: form.type === v ? c : "#94a3b8",
              }}>
              {l}
            </button>
          ))}
        </div>

        {/* Pessoa */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {PEOPLE.map((p, i) => (
            <button key={p} onClick={() => setField("person", p)}
              style={{
                padding: 12, borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14,
                border: `2px solid ${form.person === p ? COLORS_PERSON[i] : "#e2e8f0"}`,
                background: form.person === p ? COLORS_PERSON[i] + "15" : "white",
                color: form.person === p ? COLORS_PERSON[i] : "#94a3b8",
              }}>
              {i === 0 ? "👦" : "👧"} {p}
            </button>
          ))}
        </div>

        {/* Campos de texto */}
        {[["desc", "Descricao", "text", "Ex: Supermercado, Salario..."],
          ["amount", "Valor (R$)", "number", "0,00"],
          ["date", "Data", "date", ""]].map(([k, label, type, placeholder]) => (
          <div key={k}>
            <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{label}</label>
            <input
              value={form[k]}
              onChange={e => setField(k, e.target.value)}
              type={type}
              placeholder={placeholder}
              style={inputStyle}
            />
          </div>
        ))}

        {/* Categoria */}
        <div>
          <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Categoria</label>
          <select
            value={form.category}
            onChange={e => setField("category", e.target.value)}
            style={{ ...inputStyle, background: "white" }}
          >
            {CATEGORIES[form.type].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Botões */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {editId && (
            <button onClick={onCancel}
              style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontWeight: 600, color: "#64748b" }}>
              Cancelar
            </button>
          )}
          <button onClick={onSubmit}
            style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "white" }}>
            {editId ? "Salvar Alteracoes" : "Adicionar Lancamento"}
          </button>
        </div>

      </div>
    </Card>
  );
};
