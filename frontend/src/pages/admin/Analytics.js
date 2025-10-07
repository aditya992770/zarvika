// src/pages/admin/Analytics.jsx
import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    UsersIcon,
    SparklesIcon,
    ChartBarIcon,
    ClockIcon,
    UserGroupIcon,
} from "@heroicons/react/24/solid";
import api from "../../api";
import Loader from "../../components/Loader";

function Analytics() {
    const [stats, setStats] = useState({});
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loading, setLoading] = useState(true);



    const addonsData = [
        { addon: "Addon A", usage: 40 },
        { addon: "Addon B", usage: 25 },
        { addon: "Addon C", usage: 15 },
        { addon: "Addon D", usage: 20 },
    ];

    const paymentData = [
        { status: "Verified", count: 120 },
        { status: "Pending", count: 30 },
        { status: "Failed", count: 15 },
    ];

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get("/dashboard/stats");
            setStats(res.data);
            setSubscriptionData(res.data.subscriptionsGrowth || []);
        } catch (err) {
            console.error(err.response || err.message);
            alert("Failed to fetch analytics stats");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

            {/* First Row → 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card
                    title="Total Jewellers"
                    value={stats.totalJewellers}
                    icon={<UserGroupIcon className="h-7 w-7" />}
                    color="bg-indigo-100 text-indigo-600"
                />
                <Card
                    title="Active Jewellers"
                    value={stats.activeJewellers}
                    icon={<SparklesIcon className="h-7 w-7" />}
                    color="bg-green-100 text-green-600"
                />
                <Card
                    title="This Month Jewellers"
                    value={stats.thisMonthJewellers}
                    icon={<UsersIcon className="h-7 w-7" />}
                    color="bg-blue-100 text-blue-600"
                />
            </div>

            {/* Second Row → 3 Cards (left) + Graph (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left half: 3 cards stacked vertically */}
                <div className="flex flex-col gap-6">
                    <Card
                        title="Total Subscriptions"
                        value={stats.totalSubscriptions}
                        icon={<ChartBarIcon className="h-7 w-7" />}
                        color="bg-yellow-100 text-yellow-600"
                    />
                    <Card
                        title="Active Subscriptions"
                        value={stats.activeSubscriptions}
                        icon={<SparklesIcon className="h-7 w-7" />}
                        color="bg-teal-100 text-teal-600"
                    />
                    <Card
                        title="Expired Subscriptions"
                        value={stats.expiredSubscriptions}
                        icon={<ClockIcon className="h-7 w-7" />}
                        color="bg-red-100 text-red-600"
                    />
                </div>

                {/* Right half: Graph */}
                <div className="bg-white shadow rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Subscriptions Growth</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={subscriptionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="subscriptions"
                                stroke="#4f46e5"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>


            {/* Bottom Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add-ons Usage */}
                <div className="bg-white shadow rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Add-ons Usage</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={addonsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="addon" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="usage" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment Verification */}
                <div className="bg-white shadow rounded-2xl p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Payment Verification Statistics
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={paymentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

// Reusable Card Component
function Card({ title, value, icon, color }) {
    return (
        <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
            <div>
                <h2 className="text-gray-500 text-sm">{title}</h2>
                <p className="text-2xl font-bold mt-1">
                    {value !== null && value !== undefined ? value : "—"}
                </p>
            </div>
        </div>
    );
}

export default Analytics;
