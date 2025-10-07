import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import Loader from "../../components/Loader";

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch staff for the logged-in jeweller
  useEffect(() => {
    fetchStaff();
  }, [status]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params = {};
      if (status) params.status = status;

      const res = await api.get("/staff", { params });
      console.log("Staff API response:", res.data); // Debug API
      setStaffList(res.data);
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  const handleResetCredentials = async (id) => {
    try {
      const res = await api.post(`/staff/${id}/reset-credentials`);
      alert(
        `New Credentials:\nEmail: ${res.data.credentials.email}\nPassword: ${res.data.credentials.password}`
      );
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to reset credentials");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff</h1>
        <Link
          to="/staff/add"
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-700"
        >
          Add New Staff
        </Link>
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Staff Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Registered Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{staff.name || "—"}</td>
                  <td className="px-4 py-2 border">{staff.email || "—"}</td>
                  <td className="px-4 py-2 border">{staff.phone || "—"}</td>
                  <td className="px-4 py-2 border">{staff.status || "Active"}</td>
                  <td className="px-4 py-2 border">
                    {new Date(staff.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <Link
                      to={`/staff/${staff.id}`}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleResetCredentials(staff.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reset Credentials
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No Staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Staff;
