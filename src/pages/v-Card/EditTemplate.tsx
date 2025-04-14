import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiUploadCloudLine } from "react-icons/ri";
import toast from "react-hot-toast";
import {
  useGetOneSoldServicesQuery,
  useUpdateSoldServiceMutation,
} from "../../store/apiSlice/Soldslice";
import { CustomError, V_card_data } from "../../types/types";
import BtnSnipper from "../../components/global/BtnSnipper";
import ChangeBgColor from "../../components/templates/ChangeBgColor";

const CustomizeTemplate = () => {
  const [formData, setFormData] = useState<V_card_data>({
    name: "",
    bio: "",
    job: "",
    about: "",
    image: "",
    phone: "",
    address: "",
    facebook_link: "",
    instgram_link: "",
    linkedin_link: "",
    mainBackground: "",
    buttonBackground: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isColorOpen, setIsColorOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service_Id = searchParams.get("id");

  const { data: response } = useGetOneSoldServicesQuery(service_Id);
  const vCardContent = response?.soldServices?.vCardupdatableContent;

  useEffect(() => {
    if (vCardContent) {
      setFormData({
        name: vCardContent.name || "",
        bio: vCardContent.bio || "",
        job: vCardContent.job || "",
        about: vCardContent.about || "",
        image: vCardContent.image || "",
        phone: vCardContent.phone || "",
        address: vCardContent.address || "",
        facebook_link: vCardContent.facebook_link || "",
        instgram_link: vCardContent.instgram_link || "",
        linkedin_link: vCardContent.linkedin_link || "",
        mainBackground: vCardContent.mainBackground || "",
        buttonBackground: vCardContent.buttonBackground || "",
      });
      setImagePreview(vCardContent.image);
    }
  }, [vCardContent]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const [updateSoldService, { isError, error, isLoading }] =
    useUpdateSoldServiceMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formDataData = new FormData();
      formDataData.append("type", "vCard");

      Object.entries(formData).forEach(([key, value]) => {
        formDataData.append(key, value ?? "");
      });

      if (imageFile) {
        formDataData.append("profileImage", imageFile);
      }

      await updateSoldService({ id: service_Id, data: formDataData }).unwrap();
      toast.success("Sold service updated successfully");
      navigate("/client-dashboard");
    } catch (err) {
      toast.error("Something went wrong while updating");
      console.log(err);
    }
  };

  const [tempMainBackground, setTempMainBackground] = useState(
    formData.mainBackground
  );
  const [tempButtonBackground, setTempButtonBackground] = useState(
    formData.buttonBackground
  );
  const [textColor, setTextColor] = useState("text-black");
  const [btnColor, setBtnColor] = useState("text-black");

  useEffect(() => {
    if (isColorOpen) {
      setTempMainBackground(formData.mainBackground);
      setTempButtonBackground(formData.buttonBackground);
    }
  }, [isColorOpen]);

  useEffect(() => {
    const isDark = (hex: string) => {
      if (!hex) return false;
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 130;
    };

    setTextColor(isDark(tempMainBackground) ? "text-white" : "text-black");
    setBtnColor(isDark(tempButtonBackground) ? "text-white" : "text-black");
  }, [tempMainBackground, tempButtonBackground]);

  const customError = error as CustomError;
  useEffect(() => {
    if (isError && customError?.data?.message) {
      toast.error(customError.data.message);
    }
  }, [isError, error]);

  return (
    <div className="min-h-screen flex flex-col items-center text-gray-200 px-0 py-0">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Your Template</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 rounded-lg shadow-lg space-y-6"
      >
        {/* Profile Image */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-32 h-32">
            <img
              src={imagePreview ?? formData.image ?? ""}
              alt="Profile"
              className="w-full h-full object-top rounded-full object-cover border-4 border-gray-700 shadow-lg"
            />
            <label
              htmlFor="image"
              className="absolute bottom-1 right-1 bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 transition-all cursor-pointer"
            >
              <RiUploadCloudLine size={20} className="text-white" />
            </label>
          </div>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Text Fields */}
        {[
          ["name", "Name"],
          ["job", "Job"],
          ["bio", "Bio"],
          ["about", "About"],
          ["phone", "Phone"],
          ["address", "Address"],
          ["facebook_link", "Facebook Link"],
          ["instgram_link", "Instagram Link"],
          ["linkedin_link", "LinkedIn Link"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm text-gray-400 mb-2">{label}</label>
            <input
              type="text"
              value={(formData[key as keyof V_card_data] || "") as string}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        ))}

        {/* 🎨 Color Picker UI */}
        <div className="relative p-[2px] rounded-xl bg-[length:200%_200%] bg-gradient-to-r from-green-600 via-[#a531d6] to-blue-500 animate-[borderMove_4s_linear_infinite]">
          <div className="rounded-xl bg-gray-900 p-2 text-white">
            <button
              type="button"
              onClick={() => setIsColorOpen(true)}
              className="text-lg mx-auto w-full font-semibold text-center cursor-pointer"
            >
              🎨 Change color
            </button>
          </div>
        </div>

        {isColorOpen && (
          <ChangeBgColor
            tempMainBackground={tempMainBackground}
            tempButtonBackground={tempButtonBackground}
            setTempMainBackground={setTempMainBackground}
            setTempButtonBackground={setTempButtonBackground}
            setIsColorOpen={setIsColorOpen}
            setFormData={setFormData}
            formData={formData}
            ui={response?.soldServices?.vCardUi}
          />
        )}

        {/* Preview Colors */}
        <div className="flex items-center gap-2 w-full">
          <div
            style={{ backgroundColor: formData.mainBackground }}
            className={`${textColor} p-6 rounded-lg shadow-md font-semibold`}
          >
            This is how your main background will look!
          </div>
          <div
            style={{ backgroundColor: formData.buttonBackground }}
            className={`${btnColor} p-6 rounded-lg shadow-md font-semibold`}
          >
            This is how your button background will look!
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-4 py-2 cursor-pointer font-semibold bg-green-800 text-gray-100 rounded-lg shadow-md hover:bg-green-900 transition"
        >
          {isLoading ? <BtnSnipper /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default CustomizeTemplate;

// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { RiUploadCloudLine } from "react-icons/ri";
// import {
//   useGetOneSoldServicesQuery,
//   useUpdateSoldServiceMutation,
// } from "../../store/apiSlice/Soldslice";
// import toast from "react-hot-toast";
// import { CustomError, V_card_data } from "../../types/types";
// import {
//   FaFacebook,
//   FaInstagram,
//   FaLinkedin,
//   FaPhone,
//   FaTwitter,
// } from "react-icons/fa";
// import { FiMapPin } from "react-icons/fi";
// import { IoClose } from "react-icons/io5";
// import FourthUiTest from "../../components/v-card ui/FourthUiTest";
// import SecondUiTest from "../../components/v-card ui/SecondUiTest";
// import Snipper from "../../components/global/Snipper";
// import BtnSnipper from "../../components/global/BtnSnipper";
// import ChangeBgColor from "../../components/templates/ChangeBgColor";

// const CustomizeTemplate = () => {
//   const [imagePreview, setImagePreview] = useState<any>();
//   const [searchParams] = useSearchParams();
//   const [isColorOpen, setIsColorOpen] = useState(false);
//   const navigate = useNavigate();

//   //=> Get sevice id query
//   const service_Id = searchParams.get("id");

//   // Get the sold Service
//   const { data: response } = useGetOneSoldServicesQuery(service_Id);

//   const vCardContent = response?.soldServices?.vCardupdatableContent;

//   const [formData, setFormData] = useState<V_card_data>({
//     name: "",
//     bio: "",
//     job: "",
//     about: "",
//     image: "",
//     phone: "",
//     address: "",
//     facebook_link: "",
//     instgram_link: "",
//     linkedin_link: "",
//     mainBackground: "",
//     buttonBackground: "",
//   });

//   // Update formData when vCardContent is available
//   useEffect(() => {
//     if (vCardContent) {
//       setFormData({
//         name: vCardContent?.name || "",
//         bio: vCardContent?.bio || "",
//         job: vCardContent?.job || "",
//         about: vCardContent?.about || "",
//         image: vCardContent?.image || "",
//         phone: vCardContent?.phone || "",
//         address: vCardContent?.address || "",
//         facebook_link: vCardContent?.facebook_link || "",
//         instgram_link: vCardContent?.instgram_link || "",
//         linkedin_link: vCardContent?.linkedin_link || "",
//         mainBackground: vCardContent?.mainBackground || "",
//         buttonBackground: vCardContent?.buttonBackground || "",
//       });
//     }
//   }, [vCardContent]);

//   // handle Change Color
//   const [tempMainBackground, setTempMainBackground] = useState(
//     formData?.mainBackground
//   );
//   const [tempButtonBackground, setTempButtonBackground] = useState(
//     formData?.buttonBackground
//   );

//   useEffect(() => {
//     if (isColorOpen) {
//       setTempMainBackground(formData?.mainBackground);
//       setTempButtonBackground(formData?.buttonBackground);
//     }
//   }, [isColorOpen, formData]);

//   const [textColor, setTextColor] = useState("text-black");
//   const [btnColor, setBtnColor] = useState("text-black");

//   useEffect(() => {
//     // Function to check if color is dark
//     const isDark = (hex: any) => {
//       if (!hex) return false;
//       hex = hex.replace("#", ""); // Remove #
//       const r = parseInt(hex.substring(0, 2), 16);
//       const g = parseInt(hex.substring(2, 4), 16);
//       const b = parseInt(hex.substring(4, 6), 16);
//       const brightness = (r * 299 + g * 587 + b * 114) / 1000; // Luminance formula
//       return brightness < 130; // Dark if brightness is low
//     };

//     // Update text color
//     setTextColor(isDark(tempMainBackground) ? "text-white" : "text-black");
//     setBtnColor(
//       isDark(tempButtonBackground || formData?.buttonBackground)
//         ? "text-white"
//         : "text-black"
//     );
//   }, [tempButtonBackground]);

//   //=> Handle image upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setImagePreview(URL.createObjectURL(file));

//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, image: reader.result as string }));
//       };
//     }
//   };

//   //=> Handle create sold service

//   const [updateSoldService, { isError, isSuccess, error, data, isLoading }] =
//     useUpdateSoldServiceMutation();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const response = await updateSoldService({
//         id: service_Id,
//         data: formData,
//       }).unwrap();

//       console.log("Sending Data:", response);
//     } catch (error) {
//       console.log(`Error From Client Create Product ${error}`);
//     }
//   };

//   // Check if there an error or success
//   const customError = error as CustomError;

//   useEffect(() => {
//     if (isError && customError?.data?.message) {
//       toast.error(customError.data.message);
//       console.log(customError.data.message);
//     } else if (isSuccess) {
//       toast.success("sold service has updated");
//       navigate(`/client-dashboard`);
//     }
//   }, [isError, isSuccess, error, data]);

//   return (
//     <div className=" min-h-screen flex flex-col items-center text-gray-200 px-0 py-0">
//       {/* Header */}
//       <h1 className="text-2xl font-bold text-white mb-6">Edit Your Template</h1>

//       {/* Form Container */}
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md p-6 rounded-lg shadow-lg space-y-6"
//       >
//         {/* Image URL Field */}
//         <div className="relative flex flex-col items-center">
//           <div className="relative w-32 h-32">
//             <img
//               src={imagePreview || formData?.image} // Fallback image
//               alt="Profile Picture"
//               className="w-full h-full object-top rounded-full object-cover border-4 border-gray-700 shadow-lg"
//             />

//             {/* Upload Button */}
//             <label
//               htmlFor="image"
//               className="absolute bottom-1 right-1 bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 transition-all cursor-pointer"
//             >
//               <RiUploadCloudLine size={20} className="text-white" />
//             </label>
//           </div>

//           {/* Hidden Image Input */}
//           <input
//             id="image"
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="hidden"
//           />
//         </div>

//         {/* Name input Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Name</label>
//           <input
//             type="text"
//             value={formData?.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Job input Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Job</label>
//           <input
//             type="text"
//             value={formData.job}
//             onChange={(e) => setFormData({ ...formData, job: e.target.value })}
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Bio input Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Bio</label>
//           <input
//             type="text"
//             value={formData.bio}
//             onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* About input Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">About</label>
//           <input
//             type="text"
//             value={formData.about}
//             onChange={(e) =>
//               setFormData({ ...formData, about: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />

//           {/* Character Counter */}
//           <div className="text-sm mt-1 text-gray-400">
//             Characters: {formData.about.length}/100
//           </div>

//           {/* Recommendation Message */}
//           {formData.about.length < 100 && (
//             <p className="text-yellow-400 text-xs mt-1">
//               It's recommended to write at least 100 characters for a better
//               description.
//             </p>
//           )}
//         </div>

//         {/* Phone input Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Phone</label>
//           <input
//             type="text"
//             value={formData.phone}
//             onChange={(e) =>
//               setFormData({ ...formData, phone: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Address input Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Address</label>
//           <input
//             type="text"
//             value={formData.address}
//             onChange={(e) =>
//               setFormData({ ...formData, address: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Facebook input Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">
//             Facebook Link
//           </label>
//           <input
//             type="text"
//             value={formData.facebook_link}
//             onChange={(e) =>
//               setFormData({ ...formData, facebook_link: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Instgram input Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">
//             Instgram Link
//           </label>
//           <input
//             type="text"
//             value={formData.instgram_link}
//             onChange={(e) =>
//               setFormData({ ...formData, instgram_link: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Linkedin input Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">
//             Linkedin Link
//           </label>
//           <input
//             type="text"
//             value={formData.linkedin_link}
//             onChange={(e) =>
//               setFormData({ ...formData, linkedin_link: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Colors input Field */}
//         <div className="relative p-[2px] rounded-xl bg-[length:200%_200%] bg-gradient-to-r from-green-600 via-[#a531d6]  to-blue-500 animate-[borderMove_4s_linear_infinite]">
//           <div className="rounded-xl bg-gray-900 p-2 text-white">
//             <button
//               type="button"
//               onClick={() => setIsColorOpen(true)}
//               className="text-lg mx-auto w-full font-semibold text-center  cursor-pointer"
//             >
//               🎨 Change color
//             </button>
//           </div>
//         </div>

//         {isColorOpen ? (
//           <ChangeBgColor
//             tempMainBackground={tempMainBackground}
//             formData={formData}
//             tempButtonBackground={tempButtonBackground}
//             setIsColorOpen={setIsColorOpen}
//             setTempMainBackground={setTempMainBackground}
//             setTempButtonBackground={setTempButtonBackground}
//             ui={response?.soldServices?.vCardUi}
//             setFormData={setFormData}
//           />
//         ) : (
//           ""
//         )}

//         {/* Show Selected Colors */}
//         <div className="flex items-center gap-2 w-full">
//           <div
//             style={{ backgroundColor: formData.mainBackground }}
//             className={`${textColor} p-6 rounded-lg shadow-md font-semibold`}
//           >
//             This is how your main background will look!
//           </div>
//           <div
//             style={{ backgroundColor: formData.buttonBackground }}
//             className={`${btnColor} p-6 rounded-lg shadow-md font-semibold`}
//           >
//             This is how your button background will look!
//           </div>
//         </div>

//         {/* Save Button */}
//         <button
//           type="submit"
//           className="w-full px-4 py-2 cursor-pointer font-semibold bg-green-800 text-gray-100 rounded-lg shadow-md hover:bg-green-900 transition"
//         >
//           {isLoading ? <BtnSnipper /> : "Save Changes"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CustomizeTemplate;
