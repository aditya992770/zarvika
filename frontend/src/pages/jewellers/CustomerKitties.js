// src/pages/jewellers/CustomerKitties.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import Loader from "../../components/Loader";

export default function CustomerKitties() {
  const [kitties, setKitties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKitties = async () => {
      try {
        const res = await api.get("/customer-kitties");
        setKitties(res.data);
      } catch (err) {
        console.error("Error fetching kitties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKitties();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Kitties</h1>
        <Link
          to="/jewellers/customer-kitties/add"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          + Assign New Kitty
        </Link>
      </div>

      {kitties.length === 0 ? (
        <p className="text-gray-500">No customer kitties assigned yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">Kitty Name</th>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Target</th>
                <th className="px-4 py-2 border">Collected</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">End Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {kitties.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{k.kitty_name}</td>
                  <td className="px-4 py-2 border">{k.customer?.full_name || "—"}</td>
                  <td className="px-4 py-2 border">{k.kitty_type}</td>
                  <td className="px-4 py-2 border">₹{k.target_amount}</td>
                  <td className="px-4 py-2 border">₹{k.collected_amount ?? 0}</td>
                  <td className="px-4 py-2 border">{k.status}</td>
                  <td className="px-4 py-2 border">{k.start_date ?? "—"}</td>
                  <td className="px-4 py-2 border">{k.end_date ?? "—"}</td>
                  <td className="px-4 py-2 border flex space-x-2">
                    <Link
                      to={`/jewellers/customer-kitties/${k.id}/view`}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </Link>
                    <Link
                      to={`/jewellers/customer-kitties/${k.id}/edit`}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
