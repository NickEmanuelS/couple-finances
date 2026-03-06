import { useState, useEffect, useMemo } from "react";
import { subscribeToTransactions, addTransaction, updateTransaction, deleteTransaction } from "../services/transactionService";
import { CATEGORIES, DEFAULT_TRANSACTION } from "../constants";
import { parseDate } from "../utils/finance";

export const useTransactions = () => {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToTransactions(data => {
      setTxs(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const getMonthTxs = useMemo(() => (month, year) =>
    txs.filter(t => {
      const d = parseDate(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }),
    [txs]
  );

  const save = async (form, editId) => {
    const data = { ...form, amount: parseFloat(form.amount) };
    if (editId) {
      await updateTransaction(editId, data);
    } else {
      await addTransaction(data);
    }
  };

  const remove = (id) => deleteTransaction(id);

  const buildUpdatedForm = (form, key, value) => {
    const updated = { ...form, [key]: value };
    if (key === "type") updated.category = CATEGORIES[value][0];
    return updated;
  };

  return { txs, loading, getMonthTxs, save, remove, buildUpdatedForm, DEFAULT_TRANSACTION };
};
