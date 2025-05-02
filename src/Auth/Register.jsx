import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: "ROLE_ADMIN",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateFields = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username) return "username";
    if (!email) return "email";
    if (!password) return "password";
    if (!confirmPassword) return "confirm password";
    if (password !== confirmPassword) return "passwords. It do not match";
    return "";
  };

  const startTimer = () => {
    setTimer(30);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    const missing = validateFields();
    if (missing) {
      setMessage(`Please fill correct ${missing}`);
      return;
    }

    try {
      const check = await axios.get(`${BASE_URL}/web/check-email`, {
        params: { email: formData.email },
      });

      if (check.data.exists) {
        setMessage("Email already exists");
        return;
      }

      await axios.post(`${BASE_URL}/web/send-otp`, { email: formData.email });
      setMessage("OTP sent to your email");
      setOtpSent(true);
      startTimer();
    } catch (err) {
      setMessage("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/web/verify-otp`, {
        email: formData.email,
        otp: otp,
      });
      setMessage("OTP verified");
      setOtpVerified(true);
    } catch (err) {
      setMessage("Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const missing = validateFields();
    if (missing) {
      setMessage(`Please fill ${missing}`);
      setLoading(false);
      return;
    }

    if (!otpVerified) {
      setMessage("Please verify OTP before registering");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/web/register`, formData);
      if (response.status === 200) {
        setMessage("Registration Successful");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("Registration Unsuccessful");
      }
    } catch (error) {
      setMessage("Registration Unsuccessful");
    } finally {
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
          <h2 className="text-2xl font-semibold text-center text-gray-700">
            Register
          </h2>
          <form className="mt-4" onSubmit={handleSubmit}>
            
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-2 mt-2 border rounded-lg"
              onChange={handleChange}
              value={formData.username}
              readOnly={otpVerified}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 mt-2 border rounded-lg"
              onChange={handleChange}
              value={formData.email}
              readOnly={otpVerified}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 mt-2 border rounded-lg"
              onChange={handleChange}
              value={formData.password}
              readOnly={otpVerified}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-2 mt-2 border rounded-lg"
              onChange={handleChange}
              value={formData.confirmPassword}
              readOnly={otpVerified}
            />

            {/* Hidden role, default ADMIN */}
            <input type="hidden" name="roles" value="ROLE_ADMIN" />

            {otpSent && !otpVerified && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full p-2 mt-2 border rounded-lg"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="w-full p-2 mt-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Verify OTP
                </button>
              </>
            )}

            {!otpVerified && (
              <button
                type="button"
                onClick={sendOtp}
                className="w-full p-2 mt-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                disabled={timer > 0}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP"}
              </button>
            )}

            {otpVerified && (
              <button
                type="submit"
                className="w-full p-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Register
              </button>
            )}
          </form>

          {message && (
            <p className="mt-4 text-center text-red-500">{message}</p>
          )}

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-semibold"
          >
            Login
          </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default Register;
