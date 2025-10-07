import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Loader from "../../components/Loader";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [note, setNote] = useState("");

  // New states for "View" modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subscriptions");
      setSubscriptions(res.data);
    } catch (error) {
      console.error(error.response || error.message);
      alert("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (sub) => {
    setSelectedSub(sub);
    setStartDate(sub.start_date || "");
    setExpiryDate(sub.expiry_date || "");
    setNote("");
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!startDate || !expiryDate) return alert("Start date and expiry date are required");

    try {
      await api.post(`/subscriptions/${selectedSub.id}/update-plan`, {
        start_date: startDate,
        expiry_date: expiryDate,
        note,
      });
      setModalOpen(false);
      fetchSubscriptions();
    } catch (error) {
      console.error(error.response || error.message);
      alert("Failed to update subscription");
    }
  };

  const handleStatusChange = async (id, status) => {
    if (!window.confirm(`Are you sure you want to set this subscription as ${status}?`)) return;

    try {
      await api.post(`/subscriptions/${id}/update-status`, { status });
      fetchSubscriptions();
    } catch (error) {
      console.error(error.response || error.message);
      alert("Failed to update subscription status");
    }
  };

  // 📌 New: View Subscription Logs
  const handleView = async (sub) => {
    setSelectedSub(sub);
    try {
      const res = await api.get(`/subscriptions/${sub.id}/logs`);
      setLogs(res.data);
      setViewModalOpen(true);
    } catch (error) {
      console.error(error.response || error.message);
      alert("Failed to fetch subscription logs");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Subscriptions</h1>
        <button
          onClick={() => navigate("/subscriptions/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Subscription
        </button>
      </div>

      <table className="w-full border text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Jeweller</th>
            <th className="border px-4 py-2">Start Date</th>
            <th className="border px-4 py-2">Expiry Date</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.length > 0 ? (
            subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{sub.jeweller?.user?.name}</td>
                <td className="border px-4 py-2">{sub.start_date}</td>
                <td className="border px-4 py-2">{sub.expiry_date}</td>
                <td className="border px-4 py-2">{sub.status}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleView(sub)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openUpdateModal(sub)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  {sub.status === "active" && (
                    <button
                      onClick={() => handleStatusChange(sub.id, "cancelled")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  )}

                  {sub.status === "cancelled" && (
                    <button
                      onClick={() => handleStatusChange(sub.id, "active")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-gray-500">
                No subscriptions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Update Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">Update Subscription</h2>

            <label className="block mb-2 font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <label className="block mb-2 font-medium">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <label className="block mb-2 font-medium">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter note"
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded bg-green-500 text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedSub && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Subscription Details - {selectedSub.jeweller?.user?.name}
            </h2>

            <p><b>Start Date:</b> {selectedSub.start_date}</p>
            <p><b>Expiry Date:</b> {selectedSub.expiry_date}</p>
            <p><b>Status:</b> {selectedSub.status}</p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Logs</h3>
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">Action</th>
                  <th className="border px-2 py-1">Start Date</th>
                  <th className="border px-2 py-1">Expiry Date</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Notes</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{log.action}</td>
                      <td className="border px-2 py-1">{log.start_date}</td>
                      <td className="border px-2 py-1">{log.expiry_date}</td>
                      <td className="border px-2 py-1">{log.status}</td>
                      <td className="border px-2 py-1">{log.notes}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-2 text-gray-500">
                      No logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 rounded border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscriptions;
