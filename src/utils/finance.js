import { PEOPLE } from "../constants";

export const fmt = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const parseDate = dateStr => new Date(dateStr + "T12:00:00");

export const computeStats = (monthTxs) => {
  const byPerson = PEOPLE.map(p => {
    const inc = monthTxs.filter(t => t.person === p && t.type === "income").reduce((a, t) => a + t.amount, 0);
    const exp = monthTxs.filter(t => t.person === p && t.type === "expense").reduce((a, t) => a + t.amount, 0);
    return { name: p, income: inc, expense: exp, balance: inc - exp };
  });

  const totalInc = byPerson.reduce((a, p) => a + p.income, 0);
  const totalExp = byPerson.reduce((a, p) => a + p.expense, 0);

  const byCat = {};
  monthTxs
    .filter(t => t.type === "expense")
    .forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });

  const catData = Object.entries(byCat)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return { byPerson, totalInc, totalExp, totalBalance: totalInc - totalExp, catData };
};

export const computeGoalProgress = (goal, now = new Date()) => {
  const pct = Math.min((goal.saved / goal.target) * 100, 100);
  const remaining = goal.target - goal.saved;
  const isComplete = pct >= 100;
  const deadline = goal.deadline ? new Date(goal.deadline + "-01") : null;
  const monthsLeft = deadline
    ? Math.max(0, (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth()))
    : null;
  const monthlyNeeded = monthsLeft > 0 ? remaining / monthsLeft : null;

  return { pct, remaining, isComplete, deadline, monthsLeft, monthlyNeeded };
};
