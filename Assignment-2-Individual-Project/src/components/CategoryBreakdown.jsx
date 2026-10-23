import React from "react";

function CategoryBreakdown({ transactions, categories, formatCurrency }) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  const rows = categories
    .map((name) => ({
      name,
      total: expenses
        .filter((t) => t.category === name)
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="card">
      <div className="card-header">
        <h2>Spending Breakdown</h2>
        <span className="count-text">All expenses</span>
      </div>

      {rows.length === 0 ? (
        <p className="muted-text">No expenses recorded yet. Add an expense to see your breakdown.</p>
      ) : (
        <ul className="breakdown-list">
          {rows.map((row) => {
            const percent = totalExpenses > 0 ? (row.total / totalExpenses) * 100 : 0;
            return (
              <li key={row.name} className={`breakdown-item cat-${row.name.toLowerCase()}`}>
                <div className="breakdown-top">
                  <span className="badge">{row.name}</span>
                  <span className="breakdown-amount">
                    {formatCurrency(row.total)} · {percent.toFixed(1)}%
                  </span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CategoryBreakdown;
