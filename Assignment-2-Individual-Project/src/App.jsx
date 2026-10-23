import React, { useState, useEffect } from "react";
import initialTransactions from "./data/transactions.json";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import TransactionList from "./components/TransactionList.jsx";
import TransactionModal from "./components/TransactionModal.jsx";
import BudgetSection from "./components/BudgetSection.jsx";
import CategoryBreakdown from "./components/CategoryBreakdown.jsx";

const CATEGORIES = [
  "Food",
  "Travel",
  "Education",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Salary",
  "Freelance",
  "Other",
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

// Returns the current month as "YYYY-MM" so it can be compared with transaction dates
function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function App() {
  // The single source of truth for all transactions (session-only, resets on refresh)
  const [transactions, setTransactions] = useState(initialTransactions);
  const [monthlyBudget, setMonthlyBudget] = useState(15000);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [monthOnly, setMonthOnly] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [message, setMessage] = useState("");

  // Hide the success message after 3 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  // ----- Calculated values (not stored in state) -----
  const currentMonth = getCurrentMonth();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const monthExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = monthlyBudget - monthExpenses;

  // Search and filters work together
  const query = search.trim().toLowerCase();
  const visibleTransactions = transactions
    .filter((t) => {
      const matchesSearch =
        query === "" ||
        t.title.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        (t.notes || "").toLowerCase().includes(query);
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      const matchesMonth = !monthOnly || t.date.startsWith(currentMonth);
      return matchesSearch && matchesType && matchesCategory && matchesMonth;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  const hasActiveFilters =
    search !== "" || typeFilter !== "all" || categoryFilter !== "all" || monthOnly;

  // ----- Handlers -----
  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setMonthOnly(false);
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const saveTransaction = (data) => {
    if (editingTransaction) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingTransaction.id ? { ...data, id: editingTransaction.id } : t
        )
      );
      setMessage("Transaction updated successfully.");
    } else {
      const newId = transactions.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      setTransactions([{ ...data, id: newId }, ...transactions]);
      setMessage("Transaction added successfully.");
    }
    closeModal();
  };

  const deleteTransaction = (transaction) => {
    const confirmed = window.confirm(`Delete "${transaction.title}"? This cannot be undone.`);
    if (!confirmed) return;
    setTransactions(transactions.filter((t) => t.id !== transaction.id));
    setMessage("Transaction deleted.");
  };

  const updateBudget = (newBudget) => {
    setMonthlyBudget(newBudget);
    setMessage("Monthly budget updated.");
  };

  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        <Header search={search} onSearchChange={setSearch} onAddClick={openAddModal} />

        <main className="content">
          <section id="dashboard">
            <SummaryCards
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              balance={balance}
              remainingBudget={remainingBudget}
              formatCurrency={formatCurrency}
            />
          </section>

          <div className="grid-two">
            <section id="budget">
              <BudgetSection
                monthlyBudget={monthlyBudget}
                monthExpenses={monthExpenses}
                onUpdateBudget={updateBudget}
                formatCurrency={formatCurrency}
              />
            </section>
            <section id="breakdown">
              <CategoryBreakdown
                transactions={transactions}
                categories={CATEGORIES}
                formatCurrency={formatCurrency}
              />
            </section>
          </div>

          <section id="transactions">
            <TransactionList
              transactions={visibleTransactions}
              totalCount={transactions.length}
              categories={CATEGORIES}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              monthOnly={monthOnly}
              onToggleMonth={() => setMonthOnly(!monthOnly)}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              onAdd={openAddModal}
              onEdit={openEditModal}
              onDelete={deleteTransaction}
              formatCurrency={formatCurrency}
            />
          </section>
        </main>
      </div>

      {isModalOpen && (
        <TransactionModal
          key={editingTransaction ? editingTransaction.id : "new"}
          categories={CATEGORIES}
          editingTransaction={editingTransaction}
          onSave={saveTransaction}
          onClose={closeModal}
        />
      )}

      {message && (
        <div className="toast" role="status">
          ✓ {message}
        </div>
      )}
    </div>
  );
}

export default App;
