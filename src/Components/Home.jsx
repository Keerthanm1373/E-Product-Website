import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navigation/Navbar";

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/web/product`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          if (response.status === 401) {
            navigate("/login");
          }
          throw new Error(`Failed to fetch products. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleAddCart = async (product) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageName,
        quantity: 1,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  const handleDetails = (productId) => {
    navigate(`/details/${productId}`);
  };

  const filteredProducts = products.filter((product) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (product.name || "").toLowerCase().includes(searchString);
    const matchesCategory = selectedCategory === "all" || (product.category || "") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map((product) => product.category || ""))];

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full sm:w-48 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
        {error && <div className="text-red-500 text-center py-4">{error}</div>}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
         ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden"
                >
                  <div className="relative w-full h-48 rounded-lg">
                    <img
                      src={product.imageName || "https://via.placeholder.com/300x200?text=No+Image"}
                      alt={product.name}
                      className="w-full h-full object-contain rounded"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

                    <p className="text-gray-600 mb-1">
                      Status:{" "}
                      <span className={product.productAvailable ? "text-green-600" : "text-red-600"}>
                        {product.productAvailable ? "In Stock" : "Out of Stock"}
                      </span>
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2">₹{product.price}</p>
                    <button
                      onClick={() => handleAddCart(product)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg transition duration-200"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleDetails(product.id)}
                      className="block -mt-8 mx-40 text-blue-500 underline"
                    >
                      Details...
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-12">
                No products found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
