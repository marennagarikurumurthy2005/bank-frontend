import React from "react";

const Login = () => {
    


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
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

          <form  className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 ml-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              />
            </div>

                <div className="flex justify-end items-center mb-2">
                    <a href="/forgot-password" className="text-sm text-blue-600 hover:underline font-medium">Forgot password?
                    </a>
                </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-4xl font-semibold hover:bg-blue-700 transition-all duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
