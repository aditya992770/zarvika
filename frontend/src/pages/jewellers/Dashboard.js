import React, { useEffect, useState } from "react";
import api from "../../api";
import Loader from "../../components/Loader";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Static data for charts
const revenueData = [
  { month: "Jan", subscriptions: 4000, addons: 2000 },
  { month: "Feb", subscriptions: 5000, addons: 2500 },
  { month: "Mar", subscriptions: 7000, addons: 3000 },
  { month: "Apr", subscriptions: 8000, addons: 4000 },
  { month: "May", subscriptions: 12000, addons: 6000 },
  { month: "Jun", subscriptions: 15000, addons: 8000 },
  { month: "Jul", subscriptions: 10000, addons: 5000 },
];

const activityData = [
  { month: "Jan", activity: 20 },
  { month: "Feb", activity: 30 },
  { month: "Mar", activity: 45 },
  { month: "Apr", activity: 55 },
  { month: "May", activity: 60 },
  { month: "Jun", activity: 70 },
  { month: "Jul", activity: 50 },
];

export default function Dashboard({ user: propUser }) {
  const user = propUser || JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeStaff: 0,
    totalKitties: 0,
    activeKitties: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersRes = await api.get("/jeweller-customers");
        const totalCustomers = customersRes.data.length;

        const staffRes = await api.get("/staff");
        const activeStaff = staffRes.data.filter(s => s.status === "Active").length;
        const kittiesRes = await api.get("/kitties");
        const totalKitties = kittiesRes.data.length;
        const activeKitties = kittiesRes.data.filter(k => k.status === "active").length;

        setStats({ totalCustomers, activeStaff, totalKitties, activeKitties });
      } catch (err) {
        console.error("Error fetching dashboard data:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 flex-1 bg-gray-100">
      {/* Welcome */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : "User"}!
      </h1>

      {/* Dynamic Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">Total Customers</p>
          <p className="text-2xl font-semibold text-gray-800">{stats.totalCustomers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">Active Staff</p>
          <p className="text-2xl font-semibold text-gray-800">{stats.activeStaff}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">Total Kitties</p>
          <p className="text-2xl font-semibold text-gray-800">{stats.totalKitties}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">Active Kitties</p>
          <p className="text-2xl font-semibold text-gray-800">{stats.activeKitties}</p>
        </div>
      </div>

      {/* Charts (static for now) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Revenue Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="subscriptions" stroke="#4F46E5" strokeWidth={2} />
              <Line type="monotone" dataKey="addons" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Logs Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Activity Logs</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activity" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
