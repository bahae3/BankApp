import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./ClientLayout.css";

const navItems = [
  { to: "/dashboard",      icon: "pi-home",            label: "Dashboard"     },
  { to: "/balance",        icon: "pi-wallet",          label: "Balance"        },
  { to: "/card",           icon: "pi-credit-card",     label: "My Card"        },
  { to: "/transactions",   icon: "pi-list",            label: "Transactions"   },
  { to: "/transfer",       icon: "pi-arrow-right-arrow-left", label: "Transfer" },
  { to: "/deposit",        icon: "pi-download",        label: "Deposit"        },
  { to: "/loans",          icon: "pi-building",        label: "Loans"          },
  { to: "/beneficiaries",  icon: "pi-users",           label: "Beneficiaries"  },
  { to: "/account",        icon: "pi-cog",             label: "Account"        },
];

export default function ClientLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="client-layout">
      {/* Mobile Topbar */}
      <div className="mobile-topbar">
        <span className="mobile-topbar__logo">BankApp</span>
        <button 
          className="mobile-menu-btn" 
          onClick={() => document.getElementById('sidebar').classList.toggle('sidebar--open')}
        >
          <i className="pi pi-bars"></i>
        </button>
      </div>

      {/* Sidebar */}
      <aside id="sidebar" className="sidebar">
        <div className="sidebar__header">
          <i className="pi pi-building-columns sidebar__logo-icon"></i>
          <span className="sidebar__logo-text">BankApp</span>
        </div>

        <div className="sidebar__user">
          <div className="sidebar__avatar">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="user-info">
            <p className="sidebar__user-name">{user?.first_name} {user?.last_name}</p>
            <p className="sidebar__user-email">{user?.email}</p>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? "nav-item--active" : ""}`}
              onClick={() => document.getElementById('sidebar').classList.remove('sidebar--open')}
            >
              <i className={`pi ${item.icon} nav-item__icon`}></i>
              <span className="nav-item__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="sidebar__logout" onClick={toggleTheme} style={{ color: 'var(--text-secondary)' }}>
            <i className={`pi ${theme === 'dark' ? 'pi-sun' : 'pi-moon'}`}></i> 
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button id="client-logout-btn" className="sidebar__logout" onClick={handleLogout} style={{ marginTop: 0 }}>
            <i className="pi pi-sign-out"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="client-main">
        {children}
      </main>
    </div>
  );
}
