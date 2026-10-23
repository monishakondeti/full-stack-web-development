import React from "react";

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TransactionList({
  transactions,
  totalCount,
  categories,
  typeFilter,
  onTypeChange,
  categoryFilter,
  onCategoryChange,
  monthOnly,
  onToggleMonth,
  hasActiveFilters,
  onClearFilters,
  onAdd,
  onEdit,
  onDelete,
  formatCurrency,
}) {
  const typeButtons = [
    { value: "all", label: "All Transactions" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expenses" },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2>Transactions</h2>
        <span className="count-text">
          Showing {transactions.length} of {totalCount}
        </span>
      </div>

      <div className="filter-bar">
        <div className="filter-group" role="group" aria-label="Filter by type">
          {typeButtons.map((btn) => (
            <button
              key={btn.value}
              type="button"
              className={typeFilter === btn.value ? "chip active" : "chip"}
              aria-pressed={typeFilter === btn.value}
              onClick={() => onTypeChange(btn.value)}
            >
              {btn.label}
            </button>
          ))}
          <button
            type="button"
            className={monthOnly ? "chip active" : "chip"}
            aria-pressed={monthOnly}
            onClick={onToggleMonth}
          >
            Current Month
          </button>
        </div>

        <div className="filter-group">
          <label htmlFor="categoryFilter" className="filter-label">Category</label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">🗂</span>
          {totalCount === 0 ? (
            <>
              <h3>No transactions yet</h3>
              <p>Add your first income or expense to get started.</p>
              <button type="button" className="btn-primary" onClick={onAdd}>
                + Add Transaction
              </button>
            </>
          ) : (
            <>
              <h3>No matching transactions</h3>
              <p>Try a different search or clear the filters to see everything.</p>
              <button type="button" className="btn-primary" onClick={onClearFilters}>
                Clear Filters
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="tx-head" aria-hidden="true">
            <span>Transaction</span>
            <span>Category</span>
            <span>Date</span>
            <span>Type</span>
            <span className="align-right">Amount</span>
            <span className="align-right">Actions</span>
          </div>
          <ul className="tx-list">
            {transactions.map((t) => (
              <li key={t.id} className="tx-row">
                <div className="tx-main">
                  <span className={`tx-icon ${t.type}`}>{t.type === "income" ? "▲" : "▼"}</span>
                  <div>
                    <p className="tx-title">{t.title}</p>
                    {t.notes && <p className="tx-notes">{t.notes}</p>}
                  </div>
                </div>
                <span className={`badge cat-${t.category.toLowerCase()}`}>{t.category}</span>
                <span className="tx-date">{formatDate(t.date)}</span>
                <span className={`type-pill ${t.type}`}>
                  {t.type === "income" ? "Income" : "Expense"}
                </span>
                <span className={`tx-amount ${t.type}`}>
                  {t.type === "income" ? "+" : "−"}
                  {formatCurrency(t.amount)}
                </span>
                <div className="tx-actions">
                  <button
                    type="button"
                    className="btn-small"
                    onClick={() => onEdit(t)}
                    aria-label={`Edit ${t.title}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-small danger"
                    onClick={() => onDelete(t)}
                    aria-label={`Delete ${t.title}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default TransactionList;
