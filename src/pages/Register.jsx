import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    account_number: "",
    balance: "",
    password: "",
  });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false); //  state for eye toggle

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/register/`,
        formData
      );
      const data = response.data;
      const { token, user } = data;
      const { access, refresh } = token;
      const { username, account_number, balance, id } = user;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("account_number", account_number);
      localStorage.setItem("balance", balance);
      localStorage.setItem("userId", id);
      
      toast.success("User registered successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/dashboard");
      console.log("Registration successful:", response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Registration failed. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      console.error("Error registering:", error.response?.data || error.message);
    }
  };

  const navtoLog=()=>{
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <ToastContainer />

      {/* Left Side - Registration Form */}
      <div className="flex w-full md:w-1/2 h-screen justify-center items-center bg-linear-to-br from-blue-50 to-blue-100 px-4">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
            Create Account
          </h1>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1 ml-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full px-3 py-2 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1 ml-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full px-3 py-2 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1 ml-1.5">
                Account Number
              </label>
              <input
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                placeholder="16-digit account number"
                className="w-full px-3 py-2 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                maxLength={16}
                minLength={16}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1 ml-1.5">
                Initial Deposit
              </label>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold text-sm mb-1 ml-1.5">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm pr-10"
                required
              />
              <span
                className="absolute right-1/300 top-10.5 rounded-tr-4xl rounded-br-4xl border p-2 transform -translate-y-1/2 bg-blue-100 cursor-pointer text-gray-500"
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-4xl font-medium hover:bg-blue-700 transition-all duration-200 text-sm"
            >
              Register
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4 text-sm">
            Already have an account?{" "}
            <button onClick={navtoLog}><a href="" className="text-blue-600 font-semibold hover:underline">
              Login
            </a></button>
          </p>
        </div>
      </div>

      {/* Right Side - Full Image */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src="image.png"
          alt="bank background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;
