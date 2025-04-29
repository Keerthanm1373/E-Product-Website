import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navigation/Navbar";

function AddProduct() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    searchQuery: "",
    productTitle: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "productTitle") {
      setInput({ productTitle: value, searchQuery: value });
    } else {
      setInput({ ...input, [name]: value });
    }
  };
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const token = localStorage.getItem("token");

      const url = `${BASE_URL}/web/fetch-products?searchQuery=${encodeURIComponent(input.searchQuery)}&productTitle=${encodeURIComponent(input.searchQuery)}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Product fetched and saved successfully");
        navigate("/home");
      } else {
        console.error(
          "Failed to fetch and save product. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-600 font-medium animate-pulse">
                Fetching product, please wait...
              </p>
            </div>
          ) : (
      <div className="flex justify-center items-center min-h-screen py-20 bg-gray-100">
        <div className="bg-white p-8 shadow-lg rounded-lg w-96">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Fetch Product
          </h2>
          
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <input
                type="text"
                name="searchQuery"
                placeholder="Search Query (e.g. mobiles)"
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
              <input
                type="hidden"
                name="productTitle"
                placeholder="Product Title (e.g. Samsung Galaxy M14)"
                className="w-full p-2 border rounded"
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Fetch and Save Product
              </button>
            </form>
          
        </div>
      </div>
      )}
    </div>
    
  );
}

export default AddProduct;
