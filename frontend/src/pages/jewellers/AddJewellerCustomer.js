import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

function AddJewellerCustomer() {
  const { id } = useParams(); // undefined for add, id present for edit
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    dob: "",
    anniversary: "",
    customer_type: "regular",
    aadhar_number: "",
    permanent_address: "",
    residence_address: "",
    assigned_staff_id: "",
  });
  const [kycFiles, setKycFiles] = useState([]); // newly uploaded files
  const [existingKyc, setExistingKyc] = useState([]); // existing stored file paths
  const [removeKyc, setRemoveKyc] = useState([]); // files marked for removal
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch staff list
  useEffect(() => {
    api
      .get("/staff")
      .then((res) => setStaffList(res.data))
      .catch((err) =>
        console.error("Staff API error:", err.response || err.message)
      );
  }, []);

  // If editing, fetch the customer
  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/jeweller-customers/${id}`)
        .then((res) => {
          const data = res.data;
          setForm({
            full_name: data.full_name || "",
            email: data.email || "",
            mobile: data.mobile || "",
            dob: data.dob || "",
            anniversary: data.anniversary || "",
            customer_type: data.customer_type || "regular",
            aadhar_number: data.aadhar_number || "",
            permanent_address: data.permanent_address || "",
            residence_address: data.residence_address || "",
            assigned_staff_id: data.assigned_staff_id || "",
          });
          setExistingKyc(data.kyc_documents || []);
        })
        .catch((err) => {
          console.error("Fetch customer error:", err.response || err.message);
          alert("Failed to fetch customer");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setKycFiles(Array.from(e.target.files));
  };

  const toggleRemoveExisting = (path) => {
    setRemoveKyc((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // append form fields
    Object.keys(form).forEach((key) =>
      data.append(key, form[key] ?? "")
    );

    // append new KYC docs
    kycFiles.forEach((file) => data.append("kyc_documents[]", file));

    // append remove list if any
    removeKyc.forEach((p) => data.append("remove_kyc[]", p));

    try {
      if (id) {
        // Update (send _method=PUT for Laravel)
        data.append("_method", "PUT");
        await api.post(`/jeweller-customers/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Customer updated successfully!");
      } else {
        // Create
        await api.post("/jeweller-customers", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Customer added successfully!");
      }
      navigate("/jewellers/customers");
    } catch (err) {
      console.error("Save error:", err.response || err.message);
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
        alert(messages);
      } else {
        alert("Error saving customer");
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {id ? "Edit Customer" : "Add Jeweller Customer"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block mb-1 font-medium">Mobile</label>
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block mb-1 font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Anniversary */}
        <div>
          <label className="block mb-1 font-medium">Anniversary</label>
          <input
            type="date"
            name="anniversary"
            value={form.anniversary}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Customer Type */}
        <div>
          <label className="block mb-1 font-medium">Customer Type</label>
          <select
            name="customer_type"
            value={form.customer_type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="regular">Regular</option>
            <option value="vip">VIP</option>
            <option value="walk-in">Walk-in</option>
            <option value="online">Online</option>
          </select>
        </div>

        {/* Aadhaar */}
        <div>
          <label className="block mb-1 font-medium">Aadhaar Number</label>
          <input
            type="text"
            name="aadhar_number"
            placeholder="Aadhaar Number"
            value={form.aadhar_number}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Permanent Address */}
        <div>
          <label className="block mb-1 font-medium">Permanent Address</label>
          <textarea
            name="permanent_address"
            placeholder="Permanent Address"
            value={form.permanent_address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>

        {/* Residence Address */}
        <div>
          <label className="block mb-1 font-medium">Residence Address</label>
          <textarea
            name="residence_address"
            placeholder="Residence Address"
            value={form.residence_address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>

        {/* Assign Staff */}
        <div>
          <label className="block mb-1 font-medium">Assign Staff</label>
          <select
            name="assigned_staff_id"
            value={form.assigned_staff_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Assign Staff</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.user_id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>

        {/* KYC Docs */}
        <div>
          <label className="block mb-1 font-medium">
            KYC Documents (PAN/Aadhaar)
          </label>

          {/* existing docs */}
          {existingKyc.length > 0 && (
            <div className="mb-2 space-y-1">
              <div className="font-medium">Existing documents:</div>
              {existingKyc.map((path) => (
                <div key={path} className="flex items-center space-x-3">
                  <a
                    href={`${process.env.REACT_APP_API_URL}/storage/${path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {path.split("/").pop()}
                  </a>
                  <label className="ml-2 text-sm">
                    <input
                      type="checkbox"
                      checked={removeKyc.includes(path)}
                      onChange={() => toggleRemoveExisting(path)}
                    />{" "}
                    Remove
                  </label>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full"
          />
          <div className="text-sm text-gray-500 mt-1">
            Upload new files to add to KYC.
          </div>
        </div>

        <button
          type="submit"
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-700"
        >
          {id ? "Update Customer" : "Add Customer"}
        </button>
      </form>
    </div>
  );
}

export default AddJewellerCustomer;
