import React, { useEffect, useState } from "react";
import api from "../../api";
import Loader from "../../components/Loader";

function Settings() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchProfile();
  }, []);

  // Auto-hide alerts after 4 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      setProfile(res.data);
    } catch (err) {
      console.error(err.response || err.message);
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      setLoading(true);
      await api.put("/profile", profile);
      setSuccess("Profile updated successfully");
    } catch (err) {
      console.error(err.response || err.message);
      setError(err.response?.data?.message || "Update failed");
    } finally { setLoading(false); }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      await api.put("/profile", {
        ...profile,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccess("Password updated successfully");
    } catch (err) {
      console.error(err.response || err.message);
      setError(err.response?.data?.message || "Password update failed");
    } finally { setLoading(false); }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex p-6 gap-8">
      {/* Sidebar */}
      <div className="w-60 bg-white shadow rounded-2xl p-6 flex flex-col space-y-4">
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        <button
          className={`text-left px-3 py-2 rounded ${activeTab === "profile" ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile Setting
        </button>
        <button
          className={`text-left px-3 py-2 rounded ${activeTab === "system" ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}`}
          onClick={() => setActiveTab("system")}
        >
          System Setting
        </button>
        <button
          className={`text-left px-3 py-2 rounded ${activeTab === "security" ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}`}
          onClick={() => setActiveTab("security")}
        >
          Security Setting
        </button>
        <button
          className={`text-left px-3 py-2 rounded ${activeTab === "password" ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}`}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-8">
        {/* Alerts */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
            <form onSubmit={updateProfile} className="space-y-4">
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                placeholder="Name"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({...profile, email: e.target.value})}
                placeholder="Email"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                value={profile.phone}
                onChange={e => setProfile({...profile, phone: e.target.value})}
                placeholder="Phone"
                className="w-full border rounded px-3 py-2"
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
                Update Profile
              </button>
            </form>
          </div>
        )}

        {activeTab === "password" && (
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form onSubmit={updatePassword} className="space-y-4">
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                placeholder="Current Password"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                placeholder="New Password"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                placeholder="Confirm New Password"
                className="w-full border rounded px-3 py-2"
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
                Change Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;