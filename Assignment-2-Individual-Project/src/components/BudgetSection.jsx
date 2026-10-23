import React, { useState } from "react";

function BudgetSection({ monthlyBudget, monthExpenses, onUpdateBudget, formatCurrency }) {
  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget));
  const [error, setError] = useState("");

  const monthName = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const remaining = monthlyBudget - monthExpenses;
  const isOver = monthExpenses > monthlyBudget;
  const percentUsed = monthlyBudget > 0 ? (monthExpenses / monthlyBudget) * 100 : 0;
  const barWidth = monthlyBudget > 0 ? Math.min(percentUsed, 100) : monthExpenses > 0 ? 100 : 0;

  let barClass = "progress-fill ok";
  if (isOver) barClass = "progress-fill over";
  else if (percentUsed >= 75) barClass = "progress-fill warn";

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(budgetInput);
    if (budgetInput.trim() === "" || !Number.isFinite(value) || value < 0) {
      setError("Enter 0 or a positive number.");
      return;
    }
    setError("");
    onUpdateBudget(value);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Monthly Budget</h2>
        <span className="count-text">{monthName}</span>
      </div>

      <div className="budget-stats">
        <div>
          <p className="stat-label">Spent this month</p>
          <p className="stat-value">{formatCurrency(monthExpenses)}</p>
        </div>
        <div>
          <p className="stat-label">Remaining</p>
          <p className={isOver ? "stat-value expense" : "stat-value income"}>
            {formatCurrency(remaining)}
          </p>
        </div>
        <div>
          <p className="stat-label">Budget used</p>
          <p className="stat-value">
            {monthlyBudget > 0 ? `${Math.round(percentUsed)}%` : "N/A"}
          </p>
        </div>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(barWidth)}
        aria-label="Budget used"
      >
        <div className={barClass} style={{ width: `${barWidth}%` }}></div>
      </div>

      {monthlyBudget === 0 && (
        <p className="notice info">
          No budget is set. Enter a monthly budget below to start tracking.
        </p>
      )}
      {isOver && monthlyBudget > 0 && (
        <p className="notice warning" role="alert">
          ⚠ Warning: you have exceeded your budget by {formatCurrency(monthExpenses - monthlyBudget)}.
        </p>
      )}
      {isOver && monthlyBudget === 0 && (
        <p className="notice warning" role="alert">
          ⚠ Warning: you have spent {formatCurrency(monthExpenses)} with no budget set.
        </p>
      )}

      <form className="budget-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="budgetInput">Set monthly budget (₹)</label>
        <div className="budget-input-row">
          <input
            id="budgetInput"
            type="number"
            min="0"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
          />
          <button type="submit" className="btn-primary">Update</button>
        </div>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}

export default BudgetSection;
