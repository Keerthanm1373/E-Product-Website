import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if all fields are filled
    if (!formData.username || !formData.email || !formData.password || !formData.roles) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/web/register`, formData);
      if (response.status === 200) {
        setMessage("Registration Successful");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login
      } else {
        setMessage("Registration Unsuccessful");
      }
    } catch (error) {
      setMessage("Registration Unsuccessful");
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
                Registering, please wait...
              </p>
            </div>
          ) : (
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Register</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-2 mt-2 border rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 mt-2 border rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mt-2 border rounded-lg"
            onChange={handleChange}
          />
          <select
            name="roles"
            className="w-full p-2 mt-2 border rounded-lg"
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="ROLE_USER">USER</option>
            <option value="ROLE_ADMIN">ADMIN</option>
          </select>
          <button
            type="submit"
            className="w-full p-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
      )}
    </div>
  );
}

export default Register;
