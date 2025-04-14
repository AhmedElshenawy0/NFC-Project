import { useNavigate, useSearchParams } from "react-router-dom";
import profile1 from "/images/first v card.webp";
import profile2 from "/images/second v card.webp";
import profile3 from "/images/third v card.webp";
import profile4 from "/images/forth v card.webp";
import toast from "react-hot-toast";

const VCardTemplatesComponent = () => {
  const vCardStyles = [
    {
      id: 1,
      type: "firstUI",
      image: profile1,
    },
    {
      id: 2,
      type: "secondUI",
      image: profile2,
    },
    {
      id: 3,
      type: "thirdUI",
      image: profile3,
    },
    {
      id: 4,
      type: "fourthUI",
      image: profile4,
    },
  ];
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const serviceType = searchParams.get("service-type");

  const onTemplateSelect = (v_card_type: string) => {
    if (!serviceType) {
      toast.error("there is no type provided");
      console.log(serviceType);
    } else {
      navigate(
        `/customize-template?service-type=${serviceType}&v-card-ui=${v_card_type}`
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Template Selection */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vCardStyles.map((ele) => {
          return (
            <div
              key={ele?.id}
              className={`border-2 p-0 rounded-lg cursor-pointer hover:border-purple-500 transition`}
              onClick={() => onTemplateSelect(ele?.type)}
            >
              <img
                src={ele.image}
                alt={`Template ${ele?.id}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="text-center w-full max-w-md mt-8">
        <p className="mt-4 text-sm text-gray-400">
          Select a template to customize it for your needs.
        </p>
      </div>
    </div>
  );
};

export default VCardTemplatesComponent;
