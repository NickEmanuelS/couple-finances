import { useState, useEffect } from "react";
import { subscribeToGoals, addGoal, updateGoal, deleteGoal } from "../services/goalService";

export const useGoals = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const unsub = subscribeToGoals(setGoals);
    return unsub;
  }, []);

  const save = async (form, editId) => {
    const data = {
      ...form,
      target: parseFloat(form.target),
      saved: parseFloat(form.saved || 0),
    };
    if (editId) {
      await updateGoal(editId, data);
    } else {
      await addGoal(data);
    }
  };

  const addSavings = async (goalId, amount, goals) => {
    const val = parseFloat(amount);
    if (!val || isNaN(val)) return;
    const goal = goals.find(g => g.id === goalId);
    await updateGoal(goalId, { saved: Math.min(goal.saved + val, goal.target) });
  };

  const remove = (id) => deleteGoal(id);

  return { goals, save, addSavings, remove };
};
