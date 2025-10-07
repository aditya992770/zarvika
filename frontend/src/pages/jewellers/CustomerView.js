import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";

function CustomerView() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    try {
      const res = await api.get(`/jeweller-customers/${id}`);
      setCustomer(res.data);
    } catch (err) {
      console.error("Error fetching customer:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading customer details...</div>;
  }

  if (!customer) {
    return <div className="p-6 text-center text-red-500">Customer not found!</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Customer Details</h1>

      <div className="space-y-4">
        <p><strong>Name:</strong> {customer.full_name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Mobile:</strong> {customer.mobile}</p>
        <p><strong>Customer Type:</strong> {customer.customer_type}</p>
        <p><strong>Assigned Staff:</strong> {customer.staff ? customer.staff.name : "—"}</p>
        <p><strong>Date of Birth:</strong> {customer.dob || "—"}</p>
        <p><strong>Anniversary:</strong> {customer.anniversary || "—"}</p>
        <p><strong>Aadhar Number:</strong> {customer.aadhar_number || "—"}</p>
        <p><strong>Permanent Address:</strong> {customer.permanent_address || "—"}</p>
        <p><strong>Residence Address:</strong> {customer.residence_address || "—"}</p>
        <p><strong>Status:</strong> {customer.status || "Active"}</p>
        <p><strong>Created At:</strong> {new Date(customer.created_at).toLocaleString()}</p>
      </div>

      <div className="mt-6 flex space-x-3">
        <Link
          to="/jewellers/customers"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </Link>
        <Link
          to={`/jewellers/customers/${customer.id}/edit`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

export default CustomerView;
