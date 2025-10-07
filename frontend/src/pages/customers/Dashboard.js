import React, { useEffect, useState } from "react";
import api from "../../api";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeKitties, setActiveKitties] = useState([]);

  useEffect(() => {
    const fetchKitties = async () => {
      try {
        const res = await api.get("/customer-active-kitties"); // backend API for logged-in customer
        setActiveKitties(res.data);
      } catch (err) {
        console.error("Error fetching active kitties:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKitties();
  }, []);

  if (loading) return <Loader />;

  if (!activeKitties.length) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No active kitties found.</h2>
        <p>Please contact your jeweller for more details.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Active Kitties</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeKitties.map((kitty) => (
          <div key={kitty.id} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">{kitty.kitty_name}</h2>
            <p className="text-gray-500 mb-1">Next Due Date: {kitty.next_due_date}</p>
            <p className="text-gray-500 mb-1">Amount: ₹{kitty.target_amount}</p>
            <p className="text-gray-500 mb-1">Balance: ₹{kitty.target_amount - kitty.collected_amount}</p>
            <p className="text-gray-500 mb-3">Draw Date: {kitty.draw_date}</p>

            <div className="flex justify-between mt-4">
              <Link
                to={`/customers/kitties/${kitty.id}/pay`}
                className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              >
                Pay Now
              </Link>
              <Link
                to={`/customers/kitties/${kitty.id}/view`}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                View Kitty
              </Link>
              <button
                onClick={() => alert("Lucky Draw action coming soon!")}
                className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
              >
                Lucky Draw
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
