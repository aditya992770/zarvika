import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // <-- import api instead of axios

function JewellerProfile() {
  const { id } = useParams();
  const [jeweller, setJeweller] = useState(null);

  useEffect(() => {
    api
      .get(`/jewellers/${id}`) // <-- use api
      .then((res) => setJeweller(res.data))
      .catch((err) => {
        console.error(err.response || err.message);
        alert("Failed to load jeweller profile");
      });
  }, [id]);

  if (!jeweller) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{jeweller.business_name}</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        {jeweller.logo && (
          <img
            src={`http://localhost:8000/storage/${jeweller.logo}`}
            alt="Logo"
            className="w-32 h-32 object-cover rounded"
          />
        )}
        <p><strong>Name:</strong> {jeweller.user?.name}</p>
        <p><strong>Email:</strong> {jeweller.user?.email}</p>
        <p><strong>Mobile:</strong> {jeweller.user?.phone}</p>
        <p><strong>Password:</strong> {jeweller.user?.visible_password || "—"}</p>
        <p><strong>Address:</strong> {jeweller.address}</p>
        <p><strong>Status:</strong> {jeweller.status}</p>
        <p><strong>Registered:</strong> {new Date(jeweller.created_at).toLocaleString()}</p>

        {/* Placeholder for future features */}
        <h2 className="text-lg font-semibold mt-4">Subscription Plan</h2>
        <p className="text-gray-600">Not assigned yet</p>

        <h2 className="text-lg font-semibold mt-4">Assigned Staff</h2>
        <p className="text-gray-600">No staff assigned</p>

        <h2 className="text-lg font-semibold mt-4">Activity History</h2>
        <p className="text-gray-600">No activities logged</p>
      </div>
    </div>
  );
}

export default JewellerProfile;
