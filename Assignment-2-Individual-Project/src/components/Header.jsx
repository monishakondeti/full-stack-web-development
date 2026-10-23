import React from "react";

function Header({ search, onSearchChange, onAddClick }) {
  return (
    <header className="header">
      <div className="header-title">
        <h1>Dashboard</h1>
        <p>Track your income and expenses</p>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <label htmlFor="search" className="sr-only">
            Search transactions
          </label>
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            id="search"
            type="text"
            placeholder="Search title, category or notes"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button type="button" className="btn-primary" onClick={onAddClick}>
          + Add Transaction
        </button>
      </div>
    </header>
  );
}

export default Header;
