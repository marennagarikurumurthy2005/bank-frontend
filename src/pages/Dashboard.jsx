import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [credit, setCredit] = useState({ type: "credit", amount: "" });
  const [debit, setDebit] = useState({ type: "debit", amount: "" });

  // Fetch user dashboard
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/dashboard/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setUserData(response.data);
      } catch {
        toast.error("Error fetching dashboard. Please login again.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [accessToken, navigate]);

  // Fetch user transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/transactions/user/`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setTransactions(response.data);
    } catch {
      toast.error("Failed to load transactions.");
    }
  };

  useEffect(() => {
    if (!loading) fetchTransactions();
  }, [loading]);

  // Handle input changes
  const handleChange = (e, type) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    type === "credit"
      ? setCredit({ ...credit, [e.target.name]: value })
      : setDebit({ ...debit, [e.target.name]: value });
  };

  // Handle transactions (credit/debit)
  const handleTransaction = async (type) => {
    const data = type === "credit" ? credit : debit;

    if (!data.amount || Number(data.amount) <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/transaction/`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.success(`${type.toUpperCase()} successful!`);

      // Update balance in UI
      setUserData((prev) => ({
        ...prev,
        balance:
          type === "credit"
            ? Number(prev.balance) + Number(data.amount)
            : Number(prev.balance) - Number(data.amount),
      }));

      // Prepend new transaction
      setTransactions((prev) => [response.data, ...prev]);

      // Clear input
      type === "credit"
        ? setCredit({ type: "credit", amount: "" })
        : setDebit({ type: "debit", amount: "" });
    } catch (error) {
      const errMsg = error.response?.data?.error || "Transaction failed.";
      if (errMsg.toLowerCase().includes("insufficient")) {
        toast.error("Insufficient balance for debit!");
      } else if (type === "credit") {
        toast.error("Credit failed!");
      } else {
        toast.error("Debit failed!");
      }
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-blue-600 font-semibold text-lg">
        Loading your dashboard...
      </div>
    );

  if (!userData)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-semibold text-lg">
        Unable to load data. Please login again.
      </div>
    );

  const maskedAccount =
    userData.account_number?.length === 16
      ? "XXXXXXXXXX" + userData.account_number.slice(10)
      : userData.account_number || "N/A";
  const formattedBalance = Number(userData.balance || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100">
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

                    {/* Navbar */}
        <nav className="w-full bg-white shadow-md px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Left: MK Bank */}
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">MK Bank</h1>

          {/* Right: Profile + Account */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <User size={28} className="text-blue-600" />
              <span className="text-lg sm:text-xl font-semibold text-gray-700">
                {userData.username || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
            <span className="text-sm sm:text-base text-gray-600">
              Account: {maskedAccount}
            </span>
          </div>
        </nav>

      {/* Main Content */}
      <div className="p-4 sm:p-12 flex flex-col items-center mt-8 gap-8 w-full">
        {/* Welcome Card */}
        <div className="bg-white shadow-xl rounded-3xl w-full max-w-4xl p-6 sm:p-12 flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex-1 flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
              Welcome to MK Bank
            </h2>
            <p className="text-md sm:text-lg md:text-xl text-gray-700">
              Where Security Meets Excellence. Your Trust, Our Commitment...!
            </p>
          </div>
          <div className="flex-1 flex flex-col gap-4 items-center md:items-end text-center md:text-right">
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800">
              Current Balance: ₹{formattedBalance}
            </p>
          </div>
        </div>

        {/* Transactions & Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl text-center">
          {/* Credit */}
          <div className="bg-blue-50 p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-2">Credit</h3>
            <input
              type="number"
              min="0"
              step="0.01"
              name="amount"
              value={credit.amount}
              onChange={(e) => handleChange(e, "credit")}
              placeholder="Enter amount"
              className="border-green-400 p-2 sm:p-3 w-full sm:w-64 rounded-3xl bg-green-200 font-bold mb-3"
            />
            <button
              onClick={() => handleTransaction("credit")}
              className="border p-2 w-full sm:w-64 rounded-3xl font-bold bg-green-500 hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>

          {/* Debit */}
          <div className="bg-blue-50 p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-2">Debit</h3>
            <input
              type="number"
              min="0"
              step="0.01"
              name="amount"
              value={debit.amount}
              onChange={(e) => handleChange(e, "debit")}
              placeholder="Enter amount"
              className="border-red-400 p-2 sm:p-3 w-full sm:w-64 rounded-3xl bg-red-200 font-bold mb-3"
            />
            <button
              onClick={() => handleTransaction("debit")}
              className="border p-2 w-full sm:w-64 rounded-3xl font-bold bg-red-500 hover:bg-red-700 text-white transition"
            >
              Submit
            </button>
          </div>

          {/* Transaction History */}
          <div className="bg-blue-50 p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition h-64 overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-2 sticky -top-2 mt-0 p-3 bg-blue-50">Transactions</h3>
            {transactions.length === 0 ? (
              <p className="text-gray-700">No transactions yet.</p>
            ) : (
              <ul className="text-gray-700 text-sm sm:text-base">
                {transactions.map((t) => (
                  <li key={t.id} className="mb-2 text-left">
                    <span className="font-semibold">{t.type.toUpperCase()}</span>: ₹
                    {Number(t.amount).toFixed(2)} on {new Date(t.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
