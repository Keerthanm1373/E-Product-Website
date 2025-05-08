import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


function Login() {  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(`${BASE_URL}/web/login`, formData);
      
  
      let token = null;
  
      if (response.data && typeof response.data === "object" && response.data.token) {
        token = response.data.token;
      } 
      else if (response.data && typeof response.data === "string" && response.data.startsWith("ey")) {
        // JWT tokens usually start with "ey" (base64 encoding of {"alg":..})
        token = response.data;
      }
  
      if (token) {
        localStorage.setItem("token", token);
        
        const decoded = jwtDecode(token);
        const role = decoded.role || decoded.roles || decoded.authorities?.[0];
        
        
        localStorage.setItem("userRole", role);
        
        setMessage("✅ Login Successful!");
        setTimeout(() => navigate("/home"), 1000);
        } else {
        setMessage("❌ Enter valid credentials");
        localStorage.removeItem("token");
      }
      
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setMessage("❌ Enter valid credentials");
      localStorage.removeItem("token"); 
    }finally {
      setLoading(false);
    }
  };
  
  
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-indigo-100">
      {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-600 font-medium animate-pulse">
                Logging in, please wait...
              </p>
            </div>
          ) : (
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
        <p className="text-center text-gray-500">Sign in to continue</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline font-semibold"
          >
            Register here
          </button>
        </p>
        <p className="mt-4 text-center text-gray-600">
  <button
    onClick={() => navigate("/forgot-password")}
    className="text-blue-600 hover:underline font-semibold"
  >
    Forgot password?
  </button>
</p>

      </div>
      )}
    </div>
  );
}

export default Login;
