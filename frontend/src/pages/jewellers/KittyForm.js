import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

const KittyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kitty_name: "",
    kitty_type: "custom",
    start_date: "",
    end_date: "",
    target_amount: 0,
    collected_amount: 0,
    status: "active",
    description: "",
  });

  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      api.get(`/kitties/${id}`).then((res) => {
        setForm(res.data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Submitting form:", form); // 👈 debug
    if (id) {
      await api.put(`/kitties/${id}`, form);
    } else {
      await api.post("/kitties", form);
    }
    navigate("/jewellers/kittyList");
  } catch (err) {
    console.error("Save error:", err.response?.data || err.message);
    alert("Failed to save kitty. Check console for details.");
  }
};

  if (loading) {
    return <div className="p-6 text-center">Loading kitty details...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">
        {id ? "Edit Kitty" : "Add Kitty"}
      </h1>
      

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        {/* Kitty Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Kitty Name</label>
          <input
            type="text"
            name="kitty_name"
            value={form.kitty_name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-yellow-200"
          />
        </div>

        {/* Kitty Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Kitty Type</label>
          <select
            name="kitty_type"
            value={form.kitty_type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-yellow-200"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-yellow-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-yellow-200"
            />
          </div>
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Target Amount</label>
          <input
            type="number"
            name="target_amount"
            value={form.target_amount}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-yellow-200"
          />
        </div>

        {/* Notes / Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-yellow-200"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default KittyForm;
