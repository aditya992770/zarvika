// src/pages/jewellers/CustomerKittyForm.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import Loader from "../../components/Loader";

export default function CustomerKittyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    customer_id: "",
    kitty_id: "",
    status: "active",
    start_date: "",
    end_date: "",
    target_amount: "",
    notes: "",
  });

  const [customers, setCustomers] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch customers, kitties, and existing data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, kittiesRes] = await Promise.all([
          api.get("/jeweller-customers"),
          api.get("/kitties"),
        ]);
        setCustomers(customersRes.data);
        setKitties(kittiesRes.data);

        if (isEdit) {
          const res = await api.get(`/customer-kitties/view/${id}`);
          setForm({
            ...res.data,
            kitty_id: res.data.kitty_id,
            target_amount: res.data.target_amount,
            status: res.data.status || "active",
          });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  // Update target_amount when kitty is selected
  useEffect(() => {
    if (form.kitty_id) {
      const selectedKitty = kitties.find(
        (k) => String(k.id) === String(form.kitty_id)
      );
      if (selectedKitty) {
        setForm((prev) => ({
          ...prev,
          target_amount: selectedKitty.target_amount,
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, target_amount: "" }));
    }
  }, [form.kitty_id, kitties]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (isEdit) {
        await api.put(`/customer-kitties/${id}`, form);
      } else {
        await api.post("/customer-kitties", form);
      }
      navigate("/jewellers/CustomerKitties");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Save failed:", err);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {isEdit ? "Edit Customer Kitty" : "Assign New Kitty"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Select */}
        <div>
          <label className="block mb-1 font-medium">Customer</label>
          <select
            name="customer_id"
            value={form.customer_id}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
          </select>
          {errors.customer_id && (
            <p className="text-red-600">{errors.customer_id[0]}</p>
          )}
        </div>

        {/* Kitty Select */}
        <div>
          <label className="block mb-1 font-medium">Kitty</label>
          <select
            name="kitty_id"
            value={form.kitty_id}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Select Kitty --</option>
            {kitties
              .filter((k) => k.status === "active") // ✅ only active kitties
              .map((k) => (
                <option key={k.id} value={k.id}>
                  {k.kitty_name} ({k.kitty_type})
                </option>
              ))}
          </select>

          {errors.kitty_id && (
            <p className="text-red-600">{errors.kitty_id[0]}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && <p className="text-red-600">{errors.status[0]}</p>}
        </div>

        {/* Start / End Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Target Amount (readonly) */}
        <div>
          <label className="block mb-1 font-medium">Target Amount</label>
          <input
            type="number"
            name="target_amount"
            value={form.target_amount}
            readOnly
            required
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 font-medium">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {isEdit ? "Update Kitty" : "Assign Kitty"}
        </button>
      </form>
    </div>
  );
}
