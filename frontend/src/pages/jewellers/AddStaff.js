import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function AddStaff() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
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

        try {
            const res = await api.post("/staff", data);


            alert(
                `Staff registered!\nEmail: ${res.data.credentials.email}\nPassword: ${res.data.credentials.password}`
            );
            navigate("/jewellers/Staff");
        } catch (err) {
            console.error("API Error:", err.response?.data || err.message);
            alert("Error adding staff");
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Register New Staff</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
                <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
                <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border px-3 py-2 rounded"></textarea>
                <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-700">Register</button>
            </form>
        </div>
    );
}

export default AddStaff;
