import { useEffect, useState } from "react";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Typewriter from "typewriter-effect";
import {
  useDeleteCardMutation,
  useGetAllCardsQuery,
} from "../../store/apiSlice/CardSlice";
import Snipper from "../../components/global/Snipper";
import { Card, CustomError } from "../../types/types";

const Cards = () => {
  const navigate = useNavigate();
  const [shouldFetchCards, setShouldFetchCards] = useState(false);

  const { data, isLoading } = useGetAllCardsQuery(undefined, {
    skip: !shouldFetchCards,
  });
  console.log(data?.cards);

  useEffect(() => {
    setShouldFetchCards(true);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories: any = [
    "All",
    ...new Set(data?.cards?.map((card: any) => card.nfc_type)),
  ];

  const filteredCards =
    selectedCategory === "All"
      ? data?.cards
      : data?.cards.filter((card: any) => card.nfc_type === selectedCategory);

  console.log(categories);
  console.log(filteredCards);
  console.log(selectedCategory);

  // Deleting card
  const [deleting, { isSuccess, isError, error }] = useDeleteCardMutation();

  const handleDeleteCard = async (unique_code: string) => {
    try {
      await deleting(unique_code);
    } catch (error) {
      console.log(error);
    }
  };

  const customError = error as CustomError;
  console.log(error);

  useEffect(() => {
    if (isError) {
      toast.error((error as any)?.data?.message);
    } else if (isSuccess) {
      toast.success("Card deleted successfully");
    }
  }, [error, isSuccess, isError, customError]);
  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between ">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="p-2 bg-green-950 rounded-full absolute top-8 right-6 flex items-center cursor-pointer space-x-2 text-gray-400 hover:text-white transition"
        >
          <FaArrowLeft color="white" />
        </button>
        <h1 className="text-xl font-bold mb-4 text-center sm:text-left">
          <Typewriter
            options={{
              strings: ["Manage Your Cards", "Customize & Control"],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>
      </div>
      <div className="text-sm text-gray-300 mb-4">
        Total Cards: {filteredCards?.length || 0}
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center sm:justify-start">
        {categories.map((card: any) => (
          <button
            key={card}
            onClick={() => setSelectedCategory(card)}
            className={`px-3 cursor-pointer py-2 min-w-[22%] rounded-full transition ${
              selectedCategory === card
                ? "bg-green-700 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {card}
          </button>
        ))}
      </div>

      {/* Cards  */}
      {isLoading ? (
        <Snipper />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {filteredCards?.map((card: Card, i: number) => (
            <div
              key={card?.id}
              className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-800"
            >
              <div className="absolute top-4 right-4 text-xs text-gray-500">
                #{i + 1}
              </div>
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">
                {card?.nfc_type}
              </h2>

              <p className="text-gray-400 mb-1">
                <span className="font-medium text-white">Shape:</span>{" "}
                {card?.nfc_shap}
              </p>
              <p className="text-gray-400">
                <span className="font-medium text-white">Owner:</span>{" "}
                {card?.client?.first_name ? (
                  `${card?.client?.first_name} ${card?.client?.last_name}`
                ) : (
                  <span className="italic text-red-400 font-semibold">
                    Not Active
                  </span>
                )}
              </p>

              <div className="flex w-full justify-between items-center mt-6 gap-2">
                <button
                  onClick={() => handleDeleteCard(card?.unique_code)}
                  className="flex min-w-[50%]  font-medium justify-center mx-auto items-center space-x-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-xl transition-all"
                >
                  <FaTrash />
                  <span className="text-sm">Delete card</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredCards?.length === 0 && (
        <p className="text-center text-gray-400 mt-12">
          No cards available.
          <Link
            to="/admin/add-card"
            className=" cursor-pointer text-blue-400 hover:underline"
          >
            Add a new card
          </Link>
          .
        </p>
      )}
    </div>
  );
};

export default Cards;
