import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

const KittyList = () => {
  const [kitties, setKitties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKitties = async () => {
    try {
      const res = await api.get("/kitties");
      setKitties(res.data);
    } catch (err) {
      console.error("Error fetching kitties:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  const pauseKitty = async (id) => {
    try {
      await api.post(`/kitties/${id}/pause`);
      fetchKitties();
    } catch (err) {
      console.error("Pause error:", err.response || err.message);
    }
  };

  const resumeKitty = async (id) => {
    try {
      await api.post(`/kitties/${id}/resume`);
      fetchKitties();
    } catch (err) {
      console.error("Resume error:", err.response || err.message);
    }
  };

  useEffect(() => {
    fetchKitties();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading kitties...</div>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kitties</h1>
        <Link
          to="/jewellers/kitty/add"
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-700"
        >
          + Add Kitty
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Kitty Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Target</th>
              <th className="px-4 py-2 text-left">Collected</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {kitties.length > 0 ? (
              kitties.map((kitty) => (
                <tr key={kitty.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{kitty.id}</td>
                  <td className="px-4 py-2">{kitty.kitty_name}</td>
                  <td className="px-4 py-2 capitalize">{kitty.kitty_type}</td>
                  <td className="px-4 py-2 capitalize">{kitty.status}</td>
                  <td className="px-4 py-2">{kitty.target_amount}</td>
                  <td className="px-4 py-2">{kitty.collected_amount}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <Link
                      to={`/jewellers/kitty/${kitty.id}/view`}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      View
                    </Link>

                    <Link
                      to={`/jewellers/kitty/${kitty.id}/edit`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>

                    {kitty.status === "active" ? (
                      <button
                        onClick={() => pauseKitty(kitty.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => resumeKitty(kitty.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Resume
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No kitties found. Click <b>Add Kitty</b> to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KittyList;
