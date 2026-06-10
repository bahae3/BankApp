import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/admin/adminLogin/AdminLogin";

// Client pages
import Dashboard from "./pages/client/dashboard/Dashboard";
import Balance from "./pages/client/balance/Balance";
import Card from "./pages/client/card/Card";
import Transactions from "./pages/client/transactions/Transactions";
import Transfer from "./pages/client/transfer/Transfer";
import Deposit from "./pages/client/deposit/Deposit";
import Loans from "./pages/client/loans/Loans";
import Beneficiaries from "./pages/client/beneficiaries/Beneficiaries";
import Account from "./pages/client/account/Account";

// Admin pages
import AdminDashboard from "./pages/admin/adminDashboard/AdminDashboard";
import ClientsAdmin from "./pages/admin/clientsAdmin/ClientsAdmin";
import DepositsAdmin from "./pages/admin/depositsAdmin/DepositsAdmin";
import LoanRequestsAdmin from "./pages/admin/loanRequestsAdmin/LoanRequestsAdmin";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Client (protected) */}
          <Route path="/dashboard"     element={<ProtectedRoute requiredRole="client"><Dashboard /></ProtectedRoute>} />
          <Route path="/balance"       element={<ProtectedRoute requiredRole="client"><Balance /></ProtectedRoute>} />
          <Route path="/card"          element={<ProtectedRoute requiredRole="client"><Card /></ProtectedRoute>} />
          <Route path="/transactions"  element={<ProtectedRoute requiredRole="client"><Transactions /></ProtectedRoute>} />
          <Route path="/transfer"      element={<ProtectedRoute requiredRole="client"><Transfer /></ProtectedRoute>} />
          <Route path="/deposit"       element={<ProtectedRoute requiredRole="client"><Deposit /></ProtectedRoute>} />
          <Route path="/loans"         element={<ProtectedRoute requiredRole="client"><Loans /></ProtectedRoute>} />
          <Route path="/beneficiaries" element={<ProtectedRoute requiredRole="client"><Beneficiaries /></ProtectedRoute>} />
          <Route path="/account"       element={<ProtectedRoute requiredRole="client"><Account /></ProtectedRoute>} />

          {/* Admin (protected) */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/clients"   element={<ProtectedRoute requiredRole="admin"><ClientsAdmin /></ProtectedRoute>} />
          <Route path="/admin/deposits"  element={<ProtectedRoute requiredRole="admin"><DepositsAdmin /></ProtectedRoute>} />
          <Route path="/admin/loans"     element={<ProtectedRoute requiredRole="admin"><LoanRequestsAdmin /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
