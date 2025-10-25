import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgetPassword=()=>{
    toast.error("Forget password currently not working.", {
          position: "top-center",
          autoClose: 2500,})
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/login/`,
        formData
      );

      if (response.status === 200) {
        toast.success("Login successful 🎉", {
          position: "top-center",
          autoClose: 2000,
        });
        console.log("Response:", response.data);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.detail || "Invalid credentials ❌", {
          position: "top-center",
          autoClose: 2500,
        });
      } else {
        toast.error("Network error. Please try again.", {
          position: "top-center",
          autoClose: 2500,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Toast Container */}
      <ToastContainer />

      {/* Left Side - Full Image */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src="image.png"
          alt="bank background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full md:w-1/2 h-screen justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
            Welcome Back
          </h1>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 ml-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 ml-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end items-center mb-2">
              <a

                onClick={handleForgetPassword}
                href="#"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-4xl font-semibold hover:bg-blue-700 transition-all duration-200"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
