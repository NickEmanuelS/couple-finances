export const PEOPLE = ["Nicolas", "Nicole"];

export const COLORS_PERSON = ["#6366f1", "#ec4899"];

export const CATEGORIES = {
  income: ["Salário", "Freelance", "Investimentos", "13º Salário", "Bônus", "Benefício", "Aluguel Recebido", "Presente", "Reembolso", "Venda", "Outro"],
  expense: ["Alimentação", "Cartão de Crédito", "Moradia", "Aluguel", "Condomínio", "Água/Luz/Gás", "Internet/Telefone", "Transporte", "Combustível", "Uber/Táxi", "Saúde", "Farmácia", "Academia", "Lazer", "Viagem", "Restaurante", "Streaming", "Vestuário", "Educação", "Pets", "Presentes", "Casal", "Supermercado", "Parcela/Financiamento", "Assinaturas", "Outro"],
};

export const CAT_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6",
  "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#64748b",
  "#a855f7", "#06b6d4", "#84cc16", "#fb923c", "#e11d48",
];

export const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export const GOAL_ICONS = ["🏠", "✈️", "💍", "🚗", "💻", "📱", "🎓", "🏖️", "💰", "🛋️", "👶", "🐾", "🎉", "🏋️", "⚕️", "🎯"];

export const GOAL_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

export const DEFAULT_TRANSACTION = {
  desc: "",
  amount: "",
  type: "expense",
  category: "Alimentação",
  person: "Nicolas",
  date: new Date().toISOString().split("T")[0],
};

export const DEFAULT_GOAL = {
  title: "",
  target: "",
  saved: "",
  icon: "🎯",
  deadline: "",
  color: "#6366f1",
  notes: "",
};
