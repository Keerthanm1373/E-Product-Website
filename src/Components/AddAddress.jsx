import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddAddress() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    number: "",
    city: "",
    state: "",
    landmark: "",
    pincode: "",
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/web/userDetails`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({ ...prev, ...data }));
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
  await fetch(`${BASE_URL}/web/addAddress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(formData),
  });
  
  alert("Address added successfully");
  navigate("/cart");
};
if (loading)
  return (
    <div className="flex justify-center items-center h-screen bg-blue-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );


  return (
    <div className="p-6 max-w-xl mx-auto my-16 bg-gray-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add Address</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <input value={formData.username} readOnly className="w-full p-2 border rounded border-gray-600 bg-gray-200" />
        <input value={formData.email} readOnly className="w-full p-2 border rounded border-gray-600 bg-gray-200" />
        

        <input name="number" placeholder="Number" onChange={handleChange} required className="w-full p-2 border rounded border-gray-600" />
        <input name="city" placeholder="City" onChange={handleChange} required className="w-full p-2 border rounded border-gray-600" />
        <input name="state" placeholder="State" onChange={handleChange} required className="w-full p-2 border rounded border-gray-600" />
        <input name="landmark" placeholder="Landmark" onChange={handleChange} required className="w-full p-2 border rounded border-gray-600" />
        <input name="pincode" placeholder="Pincode" type="number" onChange={handleChange} required className="w-full p-2 border rounded border-gray-600" />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Save Address
        </button>
      </form>
    </div>
  );
}

export default AddAddress;