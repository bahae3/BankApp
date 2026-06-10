import { useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { useAuth } from "../../../context/AuthContext";
import ClientLayout from "../../../components/ClientLayout";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export default function Account() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);

  const handleProfileChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setLoadingProfile(true);
    try {
      await axiosClient.put("/client/account", form);
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.error || "Update failed." });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });
    setLoadingPw(true);
    try {
      await axiosClient.put("/client/account/password", { new_password: newPassword });
      setPwMsg({ type: "success", text: "Password changed successfully." });
      setNewPassword("");
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.error || "Password change failed." });
    } finally {
      setLoadingPw(false);
    }
  };

  return (
    <ClientLayout>
      <div className="page-header">
        <h1 className="page-title">Account Settings</h1>
        <p className="page-subtitle">Manage your personal information</p>
      </div>

      <div className="grid-2">
        {/* Profile */}
        <div className="glass-card">
          <h3 className="glass-card__title">Personal Information</h3>
          {profileMsg.text && (
            <div className={`alert alert--${profileMsg.type}`}>
              <i className={`pi ${profileMsg.type === 'success' ? 'pi-check-circle' : 'pi-exclamation-circle'}`}></i>
              {profileMsg.text}
            </div>
          )}
          <form onSubmit={handleProfileSubmit} className="inner-form">
            {[
              { id: "acc-fname", label: "First Name", name: "first_name", type: "text" },
              { id: "acc-lname", label: "Last Name", name: "last_name", type: "text" },
              { id: "acc-email", label: "Email", name: "email", type: "email" },
              { id: "acc-phone", label: "Phone", name: "phone", type: "tel" },
              { id: "acc-address", label: "Address", name: "address", type: "text" },
            ].map((f) => (
              <div key={f.name} className="form-field">
                <label htmlFor={f.id} className="form-field__label">{f.label}</label>
                <InputText id={f.id} type={f.type} name={f.name} value={form[f.name]} onChange={handleProfileChange} required className="form-field__input" />
              </div>
            ))}
            <Button id="update-profile-btn" type="submit" label="Save Changes" icon="pi pi-save" className="btn btn--primary" loading={loadingProfile} />
          </form>
        </div>

        {/* Password */}
        <div className="glass-card">
          <h3 className="glass-card__title">Change Password</h3>
          {pwMsg.text && (
            <div className={`alert alert--${pwMsg.type}`}>
              <i className={`pi ${pwMsg.type === 'success' ? 'pi-check-circle' : 'pi-exclamation-circle'}`}></i>
              {pwMsg.text}
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} className="inner-form">
            <div className="form-field">
              <label htmlFor="new-password" className="form-field__label">New Password</label>
              <InputText id="new-password" type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" minLength={6} required className="form-field__input" />
            </div>
            <Button id="change-pw-btn" type="submit" label="Update Password" icon="pi pi-lock" className="btn btn--primary" loading={loadingPw} />
          </form>
        </div>
      </div>
    </ClientLayout>
  );
}
