import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch(
          `${BASE_URL}/web/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          throw new Error("Failed to fetch product details");
        }
      } catch (error) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center text-lg mt-10">{error}</div>
    );
  if (!product)
    return (
      <div className="text-center mt-10 text-gray-600">No product found</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto bg-blue-200 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
      <button
  onClick={() => navigate("/home")}
  className="absolute top-18 left-8 bg-white hover:bg-gray-100  text-blue-600 font-bold py-4 px-6 text-xl rounded-r-full shadow-md"
>
  ← Back
</button>

        <div className="flex flex-col bg-blue-50 p-8 justify-center items-center ">
          <div className="flex flex-col md:flex-row ">
            <div className="md:w-1/2 bg-blue-50 p-6 flex justify-center items-center ">
              <img
                className="rounded-xl shadow-md max-h-[500px] w-auto object-contain"
                src={
                  product.imageName ||
                  "https://via.placeholder.com/400x400?text=No+Image"
                }
                alt={product.name}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x400?text=No+Image";
                }}
              />
            </div>
            <div className="p-8 md:w-1/2 py-20 ">
              <h1 className="text-4xl font-bold text-gray-800">
                {product.name}
              </h1>
              <p className="mt-5 text-2xl font-semibold text-indigo-600">
                ₹{product.price}
              </p>

              <div className="mt-6 space-y-2">
                <p className="text-gray-700">
                  Availability:{" "}
                  {product.productAvailable ? (
                    <span className="text-green-600 font-semibold">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Out of Stock
                    </span>
                  )}
                </p>
                <p className="text-gray-700">Rating: ⭐ {product.rating} / 5</p>
                <p className="text-gray-700">
                  Reviews: {product.reviewCount.toLocaleString()}
                </p>
              </div>

              {product.url && (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 text-blue-600 font-medium hover:underline"
                >
                  🔗 View on Store
                </a>
              )}
              {(userRole === "SUPER_ADMIN" || userRole === "ADMIN") && (
  <button
    onClick={() => navigate(`/updateProduct/${product.id}`)}
    className="mt-6 mx-10 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg transition duration-200"
  >
    ✏️ Update Product
  </button>
)}
            </div>
          </div>
          <hr className="w-5/6 my-4 border-t-2 border-gray-500 rounded" />
          <h1 className="text-2xl font-bold text-blue-600 py-4">Description</h1>
          <p className="mt-3 text-gray-600 leading-relaxed mx-28">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Details;
