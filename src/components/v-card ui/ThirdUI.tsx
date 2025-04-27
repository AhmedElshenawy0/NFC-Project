import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { handleSaveContact } from "../../utils/contactFile";
import { isDark } from "../../utils/colorBritness";

const ThirdUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  // Default text and btn color
  const [textColor, setTextColor] = useState("text-gray-300");
  // const [textBtnColor, setTextBtnColor] = useState("text-gray-300");

  useEffect(() => {
    // check if color is dark Update text color
    setTextColor(
      isDark(data?.mainBackground) ? "text-gray-300" : "text-gray-900"
    );
    // setTextBtnColor(
    //   isDark(data?.buttonBackground) ? "text-gray-300" : "text-gray-900"
    // );
  }, [data?.mainBackground, data?.buttonBackground]);
  return (
    <div
      style={{ background: data?.mainBackground }}
      className={`min-h-screen max-w-full mx-auto flex bg-${data?.mainBackground} text-white p-6`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundImage: `linear-gradient(to bottom right, #1a1a1a, ${
            data?.mainBackground || "#ffffff"
          }, #2d2d2d)`,
        }}
        className={`w-full max-w-lg bg-gradient-to-br from-gray-900  to-gray-800 shadow-2xl rounded-2xl overflow-hidden p-6 border border-gray-700`}
      >
        <div className="relative">
          <img
            src={data?.image}
            alt="Profile"
            className="w-full h-72 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute -bottom-[15px] w-full bg-gradient-to-t from-black to-transparent p-6 text-center">
            <h2 className="text-white text-2xl font-bold">{data?.name}</h2>
            <p className="text-gold-500 text-lg font-medium">{data.job}</p>
          </div>
        </div>

        <div className="p-6 text-center">
          <p className={`${textColor} text-lg italic`}>{data?.bio}</p>
        </div>

        {/* About Section */}
        <div className="p-6 rounded-lg text-center mt-6 border border-gray-700">
          <h3 className={`text-xl font-bold text-gold-500 mb-3 ${textColor}`}>
            About
          </h3>
          <p className={`${textColor} leading-relaxed`}>
            {data?.about || "No additional information available."}
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6 mt-6">
          <a
            href={`tel:+${data.phone}`}
            className={`flex items-center gap-3 ${textColor} text-lg font-semibold`}
          >
            <FaPhone className="text-2xl" /> {data.phone}
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 ${textColor}`}
          >
            <FiMapPin className="text-2xl text-gold-400" />{" "}
            {data?.address || "Location unavailable"}
          </a>
        </div>

        <div className="flex justify-center space-x-2 mt-6">
          <a
            href="https://facebook.com"
            className="text-blue-600 text-3xl hover:text-gold-500"
          >
            <FaFacebook />
          </a>
          <a
            href="https://twitter.com"
            className="text-blue-400 text-3xl hover:text-gold-500"
          >
            <FaTwitter />
          </a>
          <a
            href="https://linkedin.com"
            className="text-blue-700 text-3xl hover:text-gold-500"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://instagram.com"
            className="text-pink-600 text-3xl hover:text-gold-500"
          >
            <FaInstagram />
          </a>
        </div>

        <div className="p-6">
          <button
            onClick={() => handleSaveContact(data)}
            style={{ background: data?.buttonBackground }}
            className={`w-full py-3 ${textColor} font-semibold text-lg rounded-lg shadow-xl transition transform hover:scale-105 `}
          >
            Save Contact
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ThirdUI;
