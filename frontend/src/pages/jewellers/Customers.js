import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/jeweller-customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetCredentials = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reset this customer's credentials?"
    );
    if (!confirmed) return;

    try {
      const res = await api.post(`/jeweller-customers/${id}/reset-credentials`);
      alert(`New credentials:\nEmail: ${res.data.credentials.email}\nPassword: ${res.data.credentials.password}`);
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to reset credentials.");
    }
  };


  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?\n\n⚠️ This will also delete their user account.`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/jeweller-customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      alert("Customer deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err.response || err.message);
      alert("Failed to delete customer");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading customers...</div>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jeweller Customers</h1>
        <Link
          to="/jewellers/customers/add"
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-700"
        >
          + Add Customer
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Mobile</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Assigned Staff</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{customer.full_name}</td>
                  <td className="px-4 py-2">{customer.email}</td>
                  <td className="px-4 py-2">{customer.mobile}</td>
                  <td className="px-4 py-2 capitalize">
                    {customer.customer_type}
                  </td>
                  <td className="px-4 py-2">
                    {customer.staff ? customer.staff.name : "—"}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <Link
                      to={`/jewellers/customers/${customer.id}/view`}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      View
                    </Link>

                    <Link
                      to={`/jewellers/customers/${customer.id}/edit`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(customer.id, customer.full_name)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleResetCredentials(customer.id)}
                      className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                    >
                      Reset Credentials
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No customers found. Click <b>Add Customer</b> to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
