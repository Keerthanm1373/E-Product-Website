import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navigation/Navbar";

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_BASE_URL

  useEffect(() => {
    const fetchProfileAndAddress = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const [userRes, addressRes] = await Promise.all([
          fetch(`${BASE_URL}/web/username`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/web/user/address`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!userRes.ok) throw new Error("Failed to fetch user");
        const user = await userRes.json();
        setUserData(user);

        if (addressRes.ok) {
          const addressList = await addressRes.json();
          if (addressList.length > 0) setAddressData(addressList[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndAddress();
  }, [navigate, token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center p-6 font-medium">{error}</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 relative">
          <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2">
            <img
              src={`https://ui-avatars.com/api/?name=${userData?.username}&background=3b82f6&color=fff&size=128`}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
          </div>

          <div className="mt-16 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {userData?.username}
            </h1>
            <p className="text-gray-500 text-sm">{userData?.role}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
              <h2 className="text-sm font-semibold text-gray-600 mb-1">
                Username
              </h2>
              <p className="text-base text-gray-800">{userData?.username}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
              <h2 className="text-sm font-semibold text-gray-600 mb-1">
                Email
              </h2>
              <p className="text-base text-gray-800">{userData?.email}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
              <h2 className="text-sm font-semibold text-gray-600 mb-1">Role</h2>
              <p className="text-base text-gray-800">{userData?.role}</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Address</h2>
            {!addressData ? (
              <div className="text-center text-gray-600">
                <p className="mb-4">No address available.</p>
                <button
                  onClick={() => navigate("/addAddress")}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-6 rounded-lg shadow">
                <p>
                  <strong>Name:</strong> {addressData.username}
                </p>
                <p>
                  <strong>Email:</strong> {addressData.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {addressData.number}
                </p>
                <p>
                  <strong>City:</strong> {addressData.city}
                </p>
                <p>
                  <strong>State:</strong> {addressData.state}
                </p>
                <p>
                  <strong>Landmark:</strong> {addressData.landmark}
                </p>
                <p>
                  <strong>Pincode:</strong> {addressData.pincode}
                </p>
                <div className="md:col-span-2 text-right mt-4">
                  <button
                    onClick={() => navigate("/updateAddress")}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Update Address
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
