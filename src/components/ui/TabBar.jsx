const TabBtn = ({ id, label, activeTab, onSelect }) => (
  <button
    onClick={() => onSelect(id)}
    style={{
      padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer",
      fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
      background: activeTab === id ? "#6366f1" : "transparent",
      color: activeTab === id ? "white" : "#64748b",
    }}
  >
    {label}
  </button>
);

export const TabBar = ({ activeTab, onSelect, hasEdit }) => (
  <div style={{ background: "white", borderRadius: 16, padding: "6px 10px", marginBottom: 16, display: "flex", gap: 2, overflowX: "auto" }}>
    <TabBtn id="dashboard"     label="Painel"          activeTab={activeTab} onSelect={onSelect} />
    <TabBtn id="transactions"  label="Lancamentos"     activeTab={activeTab} onSelect={onSelect} />
    <TabBtn id="goals"         label="Metas"           activeTab={activeTab} onSelect={onSelect} />
    <TabBtn id="add"           label={hasEdit ? "Editar" : "Adicionar"} activeTab={activeTab} onSelect={onSelect} />
  </div>
);
