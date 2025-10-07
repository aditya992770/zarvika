import React, { useEffect, useState } from "react";
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
import api from "../../api";
import Loader from "../../components/Loader";

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

  const [jewellerStats, setJewellerStats] = useState([]);
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    fetchJewellerStats();
  }, []);

  const fetchJewellerStats = async () => {
    try {
      setLoading(true); // Show loader
      const res = await api.get("/dashboard/stats");
      setJewellerStats([
        { label: "Total Jewellers", value: res.data.totalJewellers },
        { label: "Active Jewellers", value: res.data.activeJewellers },
        { label: "Pending Jewellers", value: res.data.pendingJewellers },
        { label: "Suspended Jewellers", value: res.data.suspendedJewellers },
      ]);
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to fetch jeweller stats");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  if (loading) return <Loader />; // Show loader until API completes

  return (
    <div className="p-6 flex-1 bg-gray-100">
      {/* Welcome */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : "User"}!
      </h1>

      {/* Jeweller Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {jewellerStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 rounded-xl shadow flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4"></div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts (static) */}
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
