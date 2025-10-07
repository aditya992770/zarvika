// src/App.js
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Super Admin Pages
import Signup from "./pages/admin/Signup";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Profile from "./pages/admin/Profile";
import JewellerList from "./pages/admin/JewellerList";
import AddJeweller from "./pages/admin/AddJeweller";
import JewellerProfile from "./pages/admin/JewellerProfile";
import Subscriptions from "./pages/admin/Subscriptions";
import AddSubscription from "./pages/admin/AddSubscription";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

// Jeweller Pages
import JewellerDashboard from "./pages/jewellers/Dashboard";
import JewellerStaff from "./pages/jewellers/Staff";
import AddStaff from "./pages/jewellers/AddStaff";
import JewellerCustomers from "./pages/jewellers/Customers";
import JewellerKitty from "./pages/jewellers/KittyList";
import KittyForm from "./pages/jewellers/KittyForm";
import KittyView from "./pages/jewellers/KittyView";
import AddJewellerCustomer from "./pages/jewellers/AddJewellerCustomer";
import CustomerKitties from "./pages/jewellers/CustomerKitties";
import CustomerKittyForm from "./pages/jewellers/CustomerKittyForm";
import JewellerCustomerKittyView from "./pages/jewellers/CustomerKittyView";

// Customers Pages
import CustomerDashboard from "./pages/customers/Dashboard";
import CustomerKittyView from "./pages/customers/Dashboard";
import CustomerKittyPayment from "./pages/customers/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import CustomerView from "./pages/jewellers/CustomerView";

function AppContent({ user, setUser }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) return <Loader />;

  // If no user, redirect to login
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }


  // Super Admin routes (role_id = 1)
  if (user.role_id === 1) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <JewellerList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/add"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <AddJeweller />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/:id"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <JewellerProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <Subscriptions />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions/add"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <AddSubscription />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  // Jeweller routes (role_id = 2)
  if (user.role_id === 2 || user.role_id === 4) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/jewellers/dashboard" replace />} />
        <Route
          path="/jewellers/dashboard"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <JewellerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/jewellers/Staff"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <JewellerStaff />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/add"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <AddStaff />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/customers"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <JewellerCustomers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/customers/add"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <AddJewellerCustomer />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/customers/:id/view"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <CustomerView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/customers/:id/edit"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <AddJewellerCustomer />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/kittyList"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <JewellerKitty />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/kitty/add"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <KittyForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/kitty/:id/edit"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <KittyForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/kitty/:id/view"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <KittyView />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/jewellers/CustomerKitties"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <CustomerKitties />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/customer-kitties/add"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <CustomerKittyForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/customer-kitties/:id/edit"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <CustomerKittyForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jewellers/customer-kitties/:id/view"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <JewellerCustomerKittyView />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* Any other route redirect to jeweller dashboard */}
        <Route path="*" element={<Navigate to="/jewellers/dashboard" replace />} />
      </Routes>
    );
  }

  if (user.role_id === 3) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/customers/dashboard" replace />} />
        <Route
          path="/customers/dashboard"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                <CustomerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Individual kitty actions */}
        <Route
          path="/customers/kitties/:id/view"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                {/* You can create a KittyView component for customers */}
                <CustomerKittyView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/kitties/:id/pay"
          element={
            <ProtectedRoute>
              <Layout user={user} setUser={setUser}>
                {/* You can create a payment component */}
                <CustomerKittyPayment />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/customers/dashboard" replace />} />
      </Routes>
    );
  }

  // Fallback in case of unknown role
  return <Navigate to="/login" replace />;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : {});
    }
  }, []);

  return (
    <BrowserRouter>
      <AppContent user={user} setUser={setUser} />
    </BrowserRouter>
  );
}

export default App;
