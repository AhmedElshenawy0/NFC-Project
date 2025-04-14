import { Link, useNavigate } from "react-router-dom";
// import {
//   useGetUsersQuery,
//   useCreateCardMutation,
// } from "../../store/apiSlice/AuthSlice";
import {
  FaPlus,
  FaIdCard,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useLogoutMutation } from "../../store/apiSlice/AuthSlice";

export const AdminDashboard = () => {
  const [logout, { isError }] = useLogoutMutation();
  console.log(isError);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const loggedoutData = await logout(undefined).unwrap();
      console.log(loggedoutData);

      toast.success("Logged out successfully!");
      if (loggedoutData.message === "success") {
        navigate("/signin?loggedOut=true");
      }
    } catch (err) {
      toast.error("Logout failed. Try again!");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-gray-100 w-full max-w-xl mx-auto p-6 rounded-2xl shadow-xl bg-gradient-to-br from-gray-900 to-black border border-green-800 transition-all"
    >
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4 tracking-wide text-mint-100">
        Admin Dashboard
      </h1>
      <hr className="w-full border-mint-600 mb-6" />

      {/* Profile Stats */}
      <div className="flex justify-between w-full mb-6">
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-mint-300">500</p>
          <p className="text-sm text-mint-100/70">Cards</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-mint-300">500</p>
          <p className="text-sm text-mint-100/70">Services</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full flex flex-col gap-4">
        <Link
          to="/add-card"
          className="flex items-center gap-3 p-4 bg-green-900 hover:bg-green-950 transition rounded-xl shadow text-mint-100"
        >
          <FaPlus className="text-xl text-[#6ee7b7]" />
          <span className="font-medium">Add New Card</span>
        </Link>

        <Link
          to="/cards"
          className="flex items-center gap-3 p-4 bg-green-900 hover:bg-green-950 transition rounded-xl shadow text-mint-100"
        >
          <FaIdCard className="text-xl text-[#6ee7b7]" />
          <span className="font-medium">View Cards</span>
        </Link>

        <Link
          to="/clients"
          className="flex items-center gap-3 p-4 bg-green-900 hover:bg-green-950 transition rounded-xl shadow text-mint-100"
        >
          <FaUsers className="text-xl text-[#6ee7b7]" />
          <span className="font-medium">View Clients</span>
        </Link>

        <Link
          to="/admin/view-services"
          className="flex items-center gap-3 p-4 bg-green-900 hover:bg-green-950 transition rounded-xl shadow text-mint-100"
        >
          <FaChartBar className="text-xl text-[#6ee7b7]" />
          <span className="font-medium">View Sold Services</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 bg-green-900 hover:bg-green-950 border border-red-900 transition rounded-xl shadow text-mint-100"
        >
          <FaSignOutAlt className="text-xl text-[#6ee7b7]" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </motion.div>
  );
};
