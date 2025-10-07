import React, { useEffect, useState } from "react";
import axios from "axios";

function Jewellers() {
  const [jewellers, setJewellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jewellers data from Laravel backend
  useEffect(() => {
    const fetchJewellers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/jewellers"); 
        setJewellers(res.data);
      } catch (error) {
        console.error("Error fetching jewellers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJewellers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center text-yellow-700 mb-6">
        Jewellers
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {jewellers.map((jeweller) => (
            <div
              key={jeweller.id}
              className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition"
            >
              <img
                src={jeweller.image || "https://via.placeholder.com/300"}
                alt={jeweller.name}
                className="w-full h-48 object-cover rounded-xl mb-3"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {jeweller.name}
              </h2>
              <p className="text-gray-600">{jeweller.description}</p>
              <p className="mt-2 font-bold text-yellow-600">
                {jeweller.location}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Jewellers;
