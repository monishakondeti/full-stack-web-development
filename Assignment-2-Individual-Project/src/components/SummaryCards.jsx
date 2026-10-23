import React from "react";

function SummaryCards({ totalIncome, totalExpenses, balance, remainingBudget, formatCurrency }) {
  const cards = [
    { label: "Total Income", value: totalIncome, icon: "▲", tone: "income" },
    { label: "Total Expenses", value: totalExpenses, icon: "▼", tone: "expense" },
    { label: "Current Balance", value: balance, icon: "◆", tone: balance < 0 ? "expense" : "primary" },
    { label: "Remaining Monthly Budget", value: remainingBudget, icon: "◎", tone: remainingBudget < 0 ? "expense" : "primary" },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div className="card summary-card" key={card.label}>
          <span className={`summary-icon ${card.tone}`}>{card.icon}</span>
          <div>
            <p className="summary-label">{card.label}</p>
            <p className={`summary-value ${card.tone}`}>{formatCurrency(card.value)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
