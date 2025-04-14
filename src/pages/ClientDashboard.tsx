import { useNavigate } from "react-router-dom";
import {
  useGetSingleUserQuery,
  useLogoutMutation,
} from "../store/apiSlice/AuthSlice";
import { motion } from "framer-motion";
import { SoldService } from "../types/types";
import toast from "react-hot-toast";
import Snipper from "../components/global/Snipper";

const ClientDashboard = () => {
  const navigate = useNavigate();

  const { data } = useGetSingleUserQuery(undefined);
  console.log(data?.user?.soldServices);

  //=> Handle click view demo
  const handleViewDemoClick = (soldServiceId: number) => {
    const soldService = data?.user?.soldServices?.find(
      (service: any) => service.id === soldServiceId
    );
    if (soldService) {
      if (soldService.type === "vCard") {
        navigate(`/template?id=${soldServiceId}`);
      } else if (soldService.type === "menu") {
        navigate(`/menu-template?id=${soldServiceId}`);
      } else {
        console.warn("Unknown service type:", soldService.type);
      }
    } else {
      console.error("Sold service not found for ID:", soldServiceId);
    }
  };

  //=> Handle click edit service
  const handleEditServiceClick = (id: number, type: string) => {
    if (type === "menu") {
      navigate(`/edit-menu?id=${id}`);
    } else if (type === "vCard") {
      navigate(`/edit-template?id=${id}`);
    }
  };

  const [logout, { isError, isLoading }] = useLogoutMutation();
  console.log(isError);

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
    <div className="flex flex-col items-center relative">
      {isLoading ? (
        <Snipper />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-[80%] max-w-5xl"
        >
          {data?.user?.soldServices.map((ele: SoldService) => (
            <motion.div
              key={ele.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl border border-green-800 transition-all"
            >
              <h4 className="text-xl font-bold text-center text-white mb-6 capitalize tracking-wide">
                {ele?.type} Service
              </h4>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleViewDemoClick(ele.id)}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
                  aria-label="View demo of this service"
                >
                  View Demo
                </button>
                <button
                  onClick={() => handleEditServiceClick(ele.id, ele.type)}
                  className="w-full px-6 py-3 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
                  aria-label="Edit this service"
                >
                  Edit Service
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <button
        onClick={handleLogout}
        className="px-6 py-2 my-7 cursor-pointer bg-red-700 text-gray-100 text-sm font-semibold rounded-lg shadow-lg hover:bg-red-800 transition-all"
      >
        Logout
      </button>
    </div>
  );
};

export default ClientDashboard;
