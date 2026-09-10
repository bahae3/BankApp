import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import "./AdminLayout.css";

const adminNav = [
  { to: "/admin/dashboard",  icon: "pi-home",     label: "Dashboard" },
  { to: "/admin/clients",    icon: "pi-users",    label: "Clients"   },
  { to: "/admin/deposits",   icon: "pi-download", label: "Deposits"  },
  { to: "/admin/loans",      icon: "pi-building", label: "Loans"     },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <i className="pi pi-lock admin-sidebar__icon"></i>
          <span className="admin-sidebar__title">Admin Panel</span>
        </div>
        <nav className="admin-nav">
          {adminNav.map((item) => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `admin-nav-item ${isActive ? "admin-nav-item--active" : ""}`}
            >
              <i className={`pi ${item.icon} admin-nav-item__icon`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="admin-sidebar__logout" onClick={toggleTheme} style={{ color: 'var(--text-secondary)' }}>
            <i className={`pi ${theme === 'dark' ? 'pi-sun' : 'pi-moon'}`}></i> 
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button id="admin-logout-btn" className="admin-sidebar__logout" onClick={() => { logout(); navigate("/admin/login"); }} style={{ marginTop: 0 }}>
            <i className="pi pi-sign-out"></i> Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
