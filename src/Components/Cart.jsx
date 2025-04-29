import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navigation/Navbar";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [step, setStep] = useState("cart");
  const [addressData, setAddressData] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(items);
    calculateTotal(items);

    fetch(`${BASE_URL}/web/user/address`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setAddressData(data[0]);
      });
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  const handleDetails = (productId) => {
    navigate(`/details/${productId}`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const removeItem = (productId) => {
    const updatedItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const handleBuy = async () => {
    setLoading(true);
    if (!addressData || !selectedPayment) return;

    const orderPayload = {
      username: addressData.username || "N/A",
      email: addressData.email || "N/A",
      number: addressData.number || "N/A",
      city: addressData.city,
      state: addressData.state,
      landmark: addressData.landmark,
      pincode: addressData.pincode,
      total: total,
      payment: selectedPayment.toLowerCase(),
      items: cartItems.map((item) => ({
        productname: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const res = await fetch(`${BASE_URL}/web/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        localStorage.removeItem("cartItems");
        setCartItems([]);
        setStep("done");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong. Please try again later.");
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
            Order processing, please wait...
          </p>
        </div>
      ) : (
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

          {step === "cart" &&
            (cartItems.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-center text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-lg shadow flex items-center justify-between cursor-pointer"
                    onClick={() => handleDetails(item.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-gray-600">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, item.quantity - 1);
                          }}
                          className="bg-gray-200 px-3 py-1 rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, item.quantity + 1);
                          }}
                          className="bg-gray-200 px-3 py-1 rounded"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="bg-white p-6 rounded-lg shadow mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Total:</span>
                    <span className="text-xl">₹{total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setStep("address")}
                    className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            ))}

          {step === "address" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              {!addressData ? (
                <>
                  <p className="mb-4 text-gray-600">No address found.</p>
                  <button
                    onClick={() => navigate("/addAddress")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Address
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    <strong>Name :</strong> {addressData.username}
                  </p>
                  <p className="mb-4">
                    <strong>Email :</strong> {addressData.email}
                  </p>
                  <p className="mb-4">
                    <strong>Mobile Number :</strong> {addressData.number}
                  </p>
                  <p className="mb-4">
                    <strong>State :</strong> {addressData.state}
                  </p>
                  <p className="mb-4">
                    <strong>City :</strong> {addressData.city}
                  </p>
                  <p className="mb-4">
                    <strong>Land Mark :</strong> {addressData.landmark}
                  </p>
                  <p className="mb-4">
                    <strong>Pincode :</strong> {addressData.pincode}
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate("/updateAddress")}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Update Address
                    </button>
                    <button
                      onClick={() => setStep("payment")}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === "payment" && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              {["UPI", "Card", "Cash on Delivery"].map((method) => (
                <div key={method} className="mb-2">
                  <input
                    type="checkbox"
                    id={method}
                    checked={selectedPayment === method}
                    onChange={() => setSelectedPayment(method)}
                    className="mr-2"
                  />
                  <label htmlFor={method}>{method}</label>
                </div>
              ))}
              <button
                disabled={!selectedPayment}
                onClick={handleBuy}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Buy Now
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h2 className="text-xl font-bold mb-4">Order Placed</h2>
              <p>Thank you for your purchase!</p>
              <button
                onClick={() => navigate("/home")}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Home
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
