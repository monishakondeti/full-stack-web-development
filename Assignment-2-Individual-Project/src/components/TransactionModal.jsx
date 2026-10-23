import React, { useState, useEffect } from "react";

function getToday() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function TransactionModal({ categories, editingTransaction, onSave, onClose }) {
  const [values, setValues] = useState(
    editingTransaction
      ? {
          title: editingTransaction.title,
          amount: String(editingTransaction.amount),
          type: editingTransaction.type,
          category: editingTransaction.category,
          date: editingTransaction.date,
          notes: editingTransaction.notes || "",
        }
      : {
          title: "",
          amount: "",
          type: "expense",
          category: "Food",
          date: getToday(),
          notes: "",
        }
  );
  const [errors, setErrors] = useState({});

  // Close the modal when the Escape key is pressed
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (values.title.trim() === "") {
      newErrors.title = "Please enter a transaction title.";
    }
    const amountNumber = Number(values.amount);
    if (values.amount === "") {
      newErrors.amount = "Please enter an amount.";
    } else if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      newErrors.amount = "Amount must be a number greater than 0.";
    }
    if (values.type === "") {
      newErrors.type = "Please select a type.";
    }
    if (values.category === "") {
      newErrors.category = "Please select a category.";
    }
    if (values.date === "") {
      newErrors.date = "Please choose a date.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      title: values.title.trim(),
      amount: Number(values.amount),
      type: values.type,
      category: values.category,
      date: values.date,
      notes: values.notes.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modalTitle">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close form">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-field full">
              <label htmlFor="title">Transaction Title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Lunch at canteen"
                value={values.title}
                onChange={handleChange}
              />
              {errors.title && <p className="error-text">{errors.title}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="amount">Amount (₹)</label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={values.amount}
                onChange={handleChange}
              />
              {errors.amount && <p className="error-text">{errors.amount}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" value={values.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              {errors.type && <p className="error-text">{errors.type}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={values.category} onChange={handleChange}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="error-text">{errors.category}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={values.date}
                onChange={handleChange}
              />
              {errors.date && <p className="error-text">{errors.date}</p>}
            </div>

            <div className="form-field full">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                placeholder="Add any extra details"
                value={values.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTransaction ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
