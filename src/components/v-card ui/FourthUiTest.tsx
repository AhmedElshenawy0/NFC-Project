import { FaRegSave } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { isDark } from "../../utils/colorBritness";
const FourthUiTest = ({
  formData,
  tempMainBackground,
  tempButtonBackground,
}: {
  formData: any;
  tempMainBackground: any;
  tempButtonBackground: any;
}) => {
  // Default text and btn color

  const [textColor, setTextColor] = useState("text-black");
  const [textBtnColor, setTextBtnColor] = useState("text-black");

  useEffect(() => {
    // Function to check if color is dark Update text color

    setTextColor(
      isDark(tempMainBackground || formData?.mainBackground)
        ? "text-white"
        : "text-black"
    );
    setTextBtnColor(
      isDark(tempButtonBackground || formData?.buttonBackground)
        ? "text-white"
        : "text-black"
    );
  }, [
    tempMainBackground,
    formData?.mainBackground,
    tempButtonBackground,
    formData?.buttonBackground,
  ]);

  const lightColor = tinycolor(tempMainBackground).lighten(60).toHexString();

  console.log(lightColor);
  console.log(formData?.mainBackground);
  console.log(tempMainBackground);

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom right, #1a1a1a, ${
          tempMainBackground || formData?.mainBackground
        }, #2d2d2d)`,
        // border: `1px solid ${
        //   tempButtonBackground || formData?.buttonBackground
        // }`,
      }}
      className="w-full max-w-lg mx-auto min-h-screen bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white rounded-2xl shadow-xl overflow-hidden p-8 relative"
    >
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        style={{
          backgroundImage: `linear-gradient(to bottom right,#1a1a1a, ${
            tempMainBackground || formData?.mainBackground
          },  #2d2d2d)`,
          border: `1px solid ${
            tempButtonBackground || formData?.buttonBackground
          }`,
        }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-8 mb-4 text-center shadow-2xl rounded-xl border border-gray-700"
      >
        <div className="relative flex justify-center">
          <img
            style={{
              border: tempMainBackground ? `8px solid ${lightColor}` : "red",
            }}
            src={formData?.image}
            alt="Profile"
            className="w-48 h-48 object-cover object-top rounded-full border-8 border-[#cbd5e1] shadow-xl transform hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h2
          className={`text-3xl ${textColor} font-extrabold mt-6  drop-shadow-lg`}
        >
          {formData?.name}
        </h2>
        <p className={`${textColor} text-lg mt-2 font-semibold`}>
          {formData?.job}
        </p>
      </motion.div>

      {/* Info Section */}
      <div
        style={{
          border: `1px solid ${
            tempButtonBackground || formData?.buttonBackground
          }`,
        }}
        className="p-6 text-center bg-opacity-10 backdrop-blur-md rounded-lg border border-gray-600"
      >
        <p className={`${textColor} font-semibold text-lg italic`}>
          {formData?.bio}
        </p>
        <p className={`text-sm mt-3 ${textColor} leading-relaxed`}>
          {formData?.about}
        </p>
      </div>

      {/* Contact Section */}
      <div className="p-6">
        <h3 className={` ${textColor} font-semibold text-xl text-center mb-4`}>
          Contact Info
        </h3>
        <div className="space-y-6">
          <motion.a
            whileHover={{ scale: 1.05 }}
            href={`tel:+${formData?.phone}`}
            style={{
              backgroundImage: `linear-gradient(to bottom right, #1a1a1a,${
                tempMainBackground || formData?.mainBackground
              }, #2d2d2d)`,
            }}
            className="flex justify-between items-center max-[390px]:flex-col max-[390px]:gap-2 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600 hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <FaPhone className={` ${textColor} text-xl`} />
              <span className={`font-semibold ${textColor}`}>Phone</span>
            </div>
            <span className={`text-lg font-bold ${textColor}`}>
              {formData?.phone}
            </span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href={""}
            target="_blank"
            style={{
              backgroundImage: `linear-gradient(to bottom right, #1a1a1a, ${
                tempMainBackground || formData?.mainBackground
              }, #2d2d2d)`,
            }}
            className="flex justify-between items-center max-[390px]:flex-col max-[390px]:gap-2 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600 hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <FiMapPin className={` text-xl ${textColor}`} />
              <span className={`font-semibold ${textColor}`}>Address</span>
            </div>
            <span className={`text-md font-bold ${textColor}`}>View Map</span>
          </motion.a>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="p-6 flex justify-center space-x-6">
        {[
          {
            icon: FaFacebook,
            color: "bg-blue-600",
          },
          {
            icon: FaTwitter,
            color: "bg-blue-400",
          },
          {
            icon: FaLinkedin,
            color: "bg-blue-700",
          },
          {
            icon: FaInstagram,
            color: "bg-pink-600",
          },
        ].map((social, index) => (
          <motion.a
            key={index}
            whileHover={{ scale: 1.1 }}
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md text-white border border-gray-500 ${social.color} transition-transform`}
          >
            {social.icon({ size: 24 })}
          </motion.a>
        ))}
      </div>

      {/* Buttons */}
      <div className="p-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: tempButtonBackground || formData?.buttonBackground,
          }}
          className={`${textBtnColor} ${formData?.buttonBackground} w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-[#000000] to-gray-700 cursor-pointer font-bold rounded-xl shadow-md hover:from-gray-300 transition`}
        >
          <FaRegSave /> Save Contact
        </motion.button>
      </div>
    </div>
  );
};

export default FourthUiTest;
