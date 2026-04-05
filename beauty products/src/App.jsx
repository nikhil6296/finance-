import { useMemo, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";

const initialTransactions = [
  { id: 1, date: "2026-04-01", amount: 50000, category: "Salary", type: "income" },
  { id: 2, date: "2026-04-02", amount: 2000, category: "Food", type: "expense" },
  { id: 3, date: "2026-04-03", amount: 3000, category: "Shopping", type: "expense" },
];

export default function Dashboard() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((t) =>
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const addDummyTransaction = () => {
    setTransactions([
      ...transactions,
      {
        id: Date.now(),
        date: "2026-04-04",
        amount: 1500,
        category: "Transport",
        type: "expense",
      },
    ]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Role Switch */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Finance Dashboard</h1>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent>Total Balance: ₹{balance}</CardContent></Card>
        <Card><CardContent>Income: ₹{totalIncome}</CardContent></Card>
        <Card><CardContent>Expenses: ₹{totalExpense}</CardContent></Card>
      </div>

      {/* Transactions */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Input
            placeholder="Search category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {role === "admin" && (
            <Button onClick={addDummyTransaction}>Add</Button>
          )}
        </div>

        <div className="border rounded p-3 space-y-2">
          {filtered.length === 0 ? (
            <p>No transactions</p>
          ) : (
            filtered.map((t) => (
              <div
                key={t.id}
                className="flex justify-between border-b pb-1"
              >
                <span>{t.date}</span>
                <span>{t.category}</span>
                <span>₹{t.amount}</span>
                <span>{t.type}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="p-4 border rounded">
        <h2 className="font-semibold">Insights</h2>
        <p>
          Highest Expense Category: {getHighestCategory(transactions)}
        </p>
      </div>
    </div>
  );
}

function getHighestCategory(transactions) {
  const map = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });

  let max = 0;
  let category = "-";

  for (let key in map) {
    if (map[key] > max) {
      max = map[key];
      category = key;
    }
  }

  return category;
}