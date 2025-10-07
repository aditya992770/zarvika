import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Loader from "../../components/Loader";

function AddSubscription() {
  const [jewellers, setJewellers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [form, setForm] = useState({
    jeweller_id: "",
    start_date: "",
    expiry_date: "",
    status: "active",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all jewellers and subscriptions
  const fetchData = async () => {
    setLoading(true);
    try {
      const [jewellersRes, subscriptionsRes] = await Promise.all([
        api.get("/jewellers"),
        api.get("/subscriptions"),
      ]);
      setJewellers(jewellersRes.data);
      setSubscriptions(subscriptionsRes.data);
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Filter jewellers without an active subscription
  const availableJewellers = jewellers.filter(
    (j) => !subscriptions.some(
      (sub) => sub.jeweller_id === j.id && sub.status === "active"
    )
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jeweller_id) return alert("Please select a jeweller");

    try {
      await api.post("/subscriptions", form);
      alert("Subscription added successfully!");
      navigate("/subscriptions");
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to add subscription");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Add Subscription</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {/* Jeweller Dropdown */}
        <div>
          <label className="block mb-1">Select Jeweller</label>
          <select
            value={form.jeweller_id}
            onChange={(e) => setForm({ ...form, jeweller_id: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value="">-- Select --</option>
            {availableJewellers.length > 0 ? (
              availableJewellers.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.user?.name} ({j.business_name})
                </option>
              ))
            ) : (
              <option value="" disabled>
                No jewellers available
              </option>
            )}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block mb-1">Expiry Date</label>
          <input
            type="date"
            value={form.expiry_date}
            onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Subscription
        </button>
      </form>
    </div>
  );
}

export default AddSubscription;