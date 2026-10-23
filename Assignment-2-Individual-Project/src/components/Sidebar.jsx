import React, { useState } from "react";

const links = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "budget", label: "Budget", icon: "◎" },
  { id: "breakdown", label: "Spending", icon: "◔" },
];

function Sidebar() {
  const [active, setActive] = useState("dashboard");

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-logo">₹</span>
        <span className="brand-name">SpendWise</span>
      </div>

      <nav className="nav" aria-label="Main navigation">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={active === link.id ? "nav-link active" : "nav-link"}
            onClick={() => setActive(link.id)}
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </nav>

      <p className="sidebar-note">
        Data is stored for this session only and resets when you refresh the page.
      </p>
    </aside>
  );
}

export default Sidebar;
