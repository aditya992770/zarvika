import React, { useEffect, useState } from "react";
import api from "../../api";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setUser(res.data));
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="mb-2"><strong>Name:</strong> {user.name}</p>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

export default Profile;
