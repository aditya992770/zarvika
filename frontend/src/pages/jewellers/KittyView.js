import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";

const KittyView = () => {
  const { id } = useParams();
  const [kitty, setKitty] = useState(null);

  useEffect(() => {
    api.get(`/kitties/${id}`).then((res) => setKitty(res.data));
  }, [id]);

  if (!kitty) {
    return <div className="p-6 text-center text-gray-500">Loading kitty...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{kitty.kitty_name}</h1>
        <Link
          to="/jewellers/kittyList"
          className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700"
        >
          ← Back
        </Link>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-xl shadow-lg border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Type</p>
            <p className="font-medium capitalize">{kitty.kitty_type}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full ${
                kitty.status === "active"
                  ? "bg-green-100 text-green-700"
                  : kitty.status === "paused"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {kitty.status}
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Target Amount</p>
            <p className="font-medium">₹ {kitty.target_amount}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Collected Amount</p>
            <p className="font-medium">₹ {kitty.collected_amount}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Start Date</p>
            <p className="font-medium">{kitty.start_date || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">End Date</p>
            <p className="font-medium">{kitty.end_date || "—"}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-gray-500 text-sm mb-1">Notes</p>
          <p className="text-gray-700 whitespace-pre-line">
            {kitty.description || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KittyView;
