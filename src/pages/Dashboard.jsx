import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  // Fetch dashboard data with timeout
  useEffect(() => {
    let timeoutId = setTimeout(() => {
      if (loading) {
        alert("Request timed out. Please login again.");
        navigate("/");
      }
    }, 30000); // 30 seconds

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/dashboard/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            timeout: 29000, // axios-level timeout slightly less than 30s
          }
        );
        setUserData(response.data);
        clearTimeout(timeoutId);
      } catch (error) {
        alert("Error fetching dashboard. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => clearTimeout(timeoutId);
  }, [accessToken, navigate, loading]);

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!userData) return <div className="text-center mt-20">Loading...</div>;

  const maskedAccount =
    userData.account_number && userData.account_number.length >= 16
      ? "XXXXXXXXXX" + userData.account_number.slice(10)
      : userData.account_number || "N/A";

  const formattedBalance = Number(userData.balance || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">MK Bank</h1>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <User size={28} className="text-blue-600" />
            <span className="text-lg sm:text-xl font-semibold text-gray-700">
              {userData.username || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
          <span className="text-sm sm:text-base text-gray-600 mt-1">
            Account: {maskedAccount}
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 sm:p-12 flex flex-col items-center mt-8">
        <div className="bg-white shadow-xl rounded-3xl w-full max-w-4xl p-8 sm:p-12 flex flex-col md:flex-row gap-8">
          {/* Left Section */}
          <div className="flex-1 flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600">
              Welcome to MK Bank
            </h2>
            <p className="text-lg sm:text-xl text-gray-700">
              Where Security Meets Excellence. Your Trust, Our Commitment....!
            </p>
          </div>

          {/* Right Section */}
          <div className="flex-1 flex flex-col gap-4 items-center md:items-end text-center md:text-right">
            <p className="text-lg sm:text-xl font-medium text-gray-800">
              Current Balance: ₹{formattedBalance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
