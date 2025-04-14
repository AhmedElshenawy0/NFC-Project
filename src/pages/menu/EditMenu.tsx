import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FiUploadCloud } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  useGetOneSoldServicesQuery,
  useUpdateMenuServiceMutation,
} from "../../store/apiSlice/Soldslice";
import BtnSnipper from "../../components/global/BtnSnipper";

const EditMenu: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const soldServieId = searchParams.get("id");

  const { data: response } = useGetOneSoldServicesQuery(soldServieId);

  const menuService = response?.soldServices?.menuUpdatableContent;
  useEffect(() => {
    if (menuService) setImages(menuService);
  }, [menuService]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setNewImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleDeleteImage = (index: number, imageUrl: string) => {
    if (images.includes(imageUrl)) {
      setDeletedImages([...deletedImages, imageUrl]);
      setImages(images.filter((img) => img !== imageUrl));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index - images.length));
    }
  };

  const [updateMenuService, { data, isLoading }] =
    useUpdateMenuServiceMutation();

  console.log(data);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!soldServieId) return toast.error("Missing ID");

    try {
      const formData = new FormData();
      formData.append("type", "menu");
      deletedImages.forEach((img) => formData.append("deletedImages[]", img));
      newImages.forEach((file) => formData.append("files", file));
      console.log("🟡 Deleted Images:", deletedImages);
      console.log("🟢 New Images:", newImages);

      console.log("📦 FormData entries:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const response = await updateMenuService({
        id: soldServieId,
        data: formData,
      }).unwrap();

      if (response?.soldService) {
        toast.success("Menu updated successfully");
        navigate("/client-dashboard");
      } else if (response?.message) {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error updating menu");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="mb-6 w-full">
        <div className="border-2 border-dashed rounded-lg p-4 text-center w-full cursor-pointer border-purple-400 bg-purple-900/20">
          <label
            htmlFor="image"
            className="text-gray-300 cursor-pointer flex flex-col-reverse"
          >
            <span>Click here to Upload images</span>
            <FiUploadCloud size={30} className="mx-auto text-purple-500" />
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {[...images, ...newImages.map((file) => URL.createObjectURL(file))].map(
        (image, index) => (
          <div
            className="mt-4 w-[calc(50%-8px)] aspect-[1/1] md:aspect-[1/1] relative"
            key={index}
          >
            <img
              src={image}
              alt="Preview"
              className="w-full h-full rounded object-cover"
            />
            <button
              onClick={() => handleDeleteImage(index, image)}
              className="absolute right-1 bottom-1 p-1 bg-red-700 rounded-full"
            >
              <AiFillDelete size={15} color="white" />
            </button>
          </div>
        )
      )}

      {(newImages.length > 0 || deletedImages.length > 0) && (
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-3 bg-green-700 rounded-lg shadow-lg hover:bg-green-900 transition-all duration-300"
        >
          {isLoading ? <BtnSnipper /> : "Save"}
        </button>
      )}
    </div>
  );
};

export default EditMenu;

// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { AiFillDelete } from "react-icons/ai";
// import { FiUploadCloud } from "react-icons/fi";
// import toast from "react-hot-toast";
// import { CustomError } from "../../types/types";
// import {
//   useGetOneSoldServicesQuery,
//   useUpdateMenuServiceMutation,
// } from "../../store/apiSlice/Soldslice";
// import BtnSnipper from "../../components/global/BtnSnipper";

// const EditMenu: React.FC = () => {
//   const navigate = useNavigate();

//   const [images, setImages] = useState<string[]>([]);
//   const [newImages, setNewImages] = useState<string[]>([]);
//   const [deletedImages, setDeletedImages] = useState<string[]>([]);

//   const [searchParams] = useSearchParams();

//   // Get service type query
//   const soldServieId = searchParams.get("id");

//   // Get exiting images from DB
//   const {
//     data: response,
//     isSuccess,
//     error,
//     isError,
//   } = useGetOneSoldServicesQuery(soldServieId);

//   console.log(error);

//   const menuService = response?.soldServices?.menuUpdatableContent;

//   useEffect(() => {
//     if (menuService) {
//       setImages(menuService);
//     }
//   }, [menuService]);

//   console.log(response);

//   const convertToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const handleImageUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (event.target.files) {
//       const filesArray = Array.from(event.target.files);
//       const base64Images = await Promise.all(
//         filesArray.map((file) => convertToBase64(file))
//       );
//       setNewImages((prevImages) => [...prevImages, ...base64Images]);
//     }
//   };

//   const handleDeleteImage = async (index: number, imageUrl: string) => {
//     try {
//       if (images.includes(imageUrl)) {
//         setDeletedImages([...deletedImages, imageUrl]);
//         setImages(images.filter((img) => img !== imageUrl)); // Remove from ui
//       } else {
//         setNewImages(newImages.filter((img) => img !== imageUrl)); // Remove from new images
//       }
//     } catch (error) {
//       toast.error("Error deleting image");
//     }
//   };

//   const [updateMenuService, { data, isLoading }] =
//     useUpdateMenuServiceMutation();
//   console.log(data);

//   const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     if (!soldServieId) {
//       toast.error("There is no type provided");
//     } else {
//       try {
//         const updatedImages = [...newImages];

//         // Update with new image data
//         const response = await updateMenuService({
//           id: soldServieId,
//           data: { updatedImages, deletedImages },
//         }).unwrap();

//         console.log(response);

//         toast.success("Menu updated successfully");

//         setNewImages([]);
//         setImages([]);
//         setDeletedImages([]);
//         setImages(menuService);
//         navigate("/client-dashboard");
//       } catch (error) {
//         toast.error("Error updating menu");
//         console.log(`Error from while updating menu ${error}`);
//       }
//     }
//   };

//   // Handle error
//   const customError = error as CustomError;

//   useEffect(() => {
//     if (isError && customError?.data?.message) {
//       toast.error(customError.data.message);
//     }
//   }, [isError, error, response]);

//   return (
//     <div className="flex flex-col items-center ">
//       {/* Upload Button */}
//       <div className="mb-6 w-full">
//         <div className="border-2 border-dashed rounded-lg p-4 text-center w-[100%] cursor-pointer border-purple-400 bg-purple-900/20">
//           <label
//             htmlFor="image"
//             className="text-gray-300 cursor-pointer flex flex-col-reverse"
//           >
//             <span>Click here to Upload images</span>
//             <FiUploadCloud size={30} className="mx-auto text-purple-500" />
//           </label>
//           <input
//             type="file"
//             id="image"
//             accept="image/*"
//             multiple
//             className="hidden"
//             onChange={handleImageUpload}
//           />
//         </div>
//       </div>

//       {/* Display Existing Images */}
//       {(images.length > 0 || newImages.length > 0) && (
//         <div className="flex gap-2 flex-wrap w-full">
//           {[...images, ...newImages].map((image, index) => (
//             <div
//               className="mt-4 w-[calc(50%-8px)] aspect-[1/1] md:aspect-[1/1] relative"
//               key={index}
//             >
//               <img
//                 src={image}
//                 alt={`Menu image ${index}`}
//                 className="w-full h-full rounded object-cover"
//               />
//               <button
//                 onClick={() => handleDeleteImage(index, image)}
//                 className="absolute bg-red-700 right-1 bottom-1 p-1 rounded-full w-fit cursor-pointer"
//               >
//                 <AiFillDelete size={15} color="white" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Confirm Button */}
//       {(newImages.length > 0 || deletedImages.length > 0) && (
//         <button
//           onClick={(e) => handleSubmit(e)}
//           className="mt-6 px-6 py-3 bg-green-700 rounded-lg shadow-lg hover:bg-green-900 transition-all duration-300"
//         >
//           {isLoading ? <BtnSnipper /> : "Save"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default EditMenu;
