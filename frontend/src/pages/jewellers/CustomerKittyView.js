// src/pages/jewellers/CustomerKittyView.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import Loader from "../../components/Loader";

export default function CustomerKittyView() {
    const { id } = useParams();
    const [kitty, setKitty] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get(`/customer-kitties/view/${id}`).then((res) => {
            setKitty(res.data);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <Loader />;
    if (!kitty) return <p>Kitty not found.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Customer Kitty Details</h1>
            <div className="bg-white p-6 rounded shadow space-y-2">
                <p><b>Kitty Name:</b> {kitty.kitty_name}</p>
                <p><b>Customer:</b> {kitty.customer?.full_name}</p>
                <p><b>Type:</b> {kitty.kitty_type}</p>
                <p><b>Target Amount:</b> ₹{kitty.target_amount}</p>
                <p><b>Collected:</b> ₹{kitty.collected_amount}</p>
                <p><b>Status:</b> {kitty.status}</p>
                <p><b>Start Date:</b> {kitty.start_date}</p>
                <p><b>End Date:</b> {kitty.end_date}</p>
                <p><b>Notes:</b> {kitty.notes}</p>
            </div>

            <div className="mt-4">
                <Link
                    to={`/jewellers/customer-kitties/${id}/edit`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                    Edit
                </Link>
            </div>
        </div>
    );
}
