import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function AddJeweller() {
  const [form, setForm] = useState({
    name: "",
    business_name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (logo) data.append("logo", logo);

    try {
      const res = await api.post("/jewellers", data); // <-- use api, no manual Content-Type

      alert(
        `Jeweller registered!\nUsername: ${res.data.credentials.email}\nPassword: ${res.data.credentials.password}`
      );
      navigate("/jewellers");
    } catch (err) {
      console.error(err.response || err.message);
      alert("Error adding jeweller");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register New Jeweller</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input type="text" name="business_name" placeholder="Business Name" value={form.business_name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <input type="text" name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border px-3 py-2 rounded"></textarea>
        <input type="file" onChange={(e) => setLogo(e.target.files[0])} className="w-full" />
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-700">Register</button>
      </form>
    </div>
  );
}

export default AddJeweller;
