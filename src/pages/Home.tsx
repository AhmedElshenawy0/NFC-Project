import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVerifyCardQuery } from "../store/apiSlice/CardSlice";
import toast from "react-hot-toast";
import { CustomError } from "../types/types";
import Snipper from "../components/global/Snipper";

const RootLayout = () => {
  //=> Get unique_code query
  const [searchParams] = useSearchParams();

  const unique_code = searchParams.get("unique_code");

  //=> Verify card
  const {
    isError,
    error,
    isLoading,
    data: verifyCard,
  } = useVerifyCardQuery(unique_code, {
    skip: !unique_code, //=> Only fetch when unique_code is exist
  });

  //=> Handle Verify click btn
  const handleVerifyClick = () => {
    if (!unique_code) {
      toast.error("There is no card identifire provided");
    } else if (verifyCard?.message === "Go to signup") {
      navigate(`/signup?type=${verifyCard?.type}&cardId=${verifyCard?.cardId}`);
    }
  };

  //=> Handdle actions after verifying
  const navigate = useNavigate();
  const [showConfirmBtn, setShowConfirmBtn] = useState<boolean>(false);

  useEffect(() => {
    if (verifyCard?.message === "Go to signup") {
      setShowConfirmBtn(true);
      console.log(verifyCard);
    } else if (verifyCard?.message === "success") {
      toast.success(`Welcom,${verifyCard?.name}`);
      navigate("/client-dashboard");
    }
  }, [verifyCard, navigate]);
  console.log(error);

  //=> Handle error if exist
  useEffect(() => {
    const customError = error as CustomError;

    if (isError && customError?.data?.message) {
      toast.error(customError.data.message);
      if (customError?.status === 401) {
        navigate(
          `/signin?type=${customError?.data?.type}&cardId=${customError?.data?.cardId}`
        );
      }
    }
  }, [isError, error]);

  return (
    <div className="flex flex-col items-center ">
      {/* Input Section */}
      <div className="w-full max-w-md mb-8">
        <label className="block text-sm text-gray-400 mb-2">
          Copy Your Code
        </label>
        <input
          type="text"
          placeholder="Your unique code"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          value={unique_code || ""}
          readOnly
        />
      </div>

      {/* Video Section */}
      <div className="w-full max-w-lg mb-8 rounded-lg overflow-hidden shadow-xl">
        <iframe
          src="https://www.youtube.com/embed/Bovaj3UYDGA"
          className="w-full"
          height={180}
          title="YouTube Video"
          allowFullScreen
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        {showConfirmBtn ? (
          <button
            onClick={handleVerifyClick}
            className="cursor-pointer flex justify-center gap-2 py-2 bg-green-900 text-gray-100 w-full font-semibold rounded-full shadow-lg hover:bg-green-900 transition duration-500"
          >
            <span>Let's Get Started</span>
            {isLoading ? <Snipper /> : ""}
          </button>
        ) : (
          ""
        )}
        <p className="mt-4 text-sm text-gray-400">
          Activate your world with our innovative card solution!
        </p>
      </div>
    </div>
  );
};

export default RootLayout;
