import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdateAddress() {
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL; 

  useEffect(() => {
    fetch(`${BASE_URL}/web/user/address`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData(data[0]);
        setLoading(false); 
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); 
      });
  }, [BASE_URL, token]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${BASE_URL}/web/updateAddress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });

    alert("Address updated successfully");
    navigate("/cart");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="p-6 max-w-xl mx-auto my-16 bg-gray-300 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Update Address</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <input value={formData.username} readOnly className="w-full p-2 bg-gray-200 border rounded border-gray-600" />
        <input value={formData.email} readOnly className="w-full p-2 bg-gray-200 border rounded border-gray-600" />

        <input name="number" value={formData.number} onChange={handleChange} className="w-full p-2 border rounded border-gray-600" />
        <input name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded border-gray-600" />
        <input name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded border-gray-600" />
        <input name="landmark" value={formData.landmark} onChange={handleChange} className="w-full p-2 border rounded border-gray-600" />
        <input name="pincode" value={formData.pincode} type="number" onChange={handleChange} className="w-full p-2 border rounded border-gray-600" />

        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Update Address
        </button>
      </form>
    </div>
  );
}

export default UpdateAddress;
