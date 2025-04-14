import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import Typewriter from "typewriter-effect";
import "swiper/css";
// import "swiper/css/effect-cards";
import "../../index.css";
import { useGetOneSoldServicesQuery } from "../../store/apiSlice/Soldslice";
import Snipper from "../../components/global/Snipper";

const MenuTemplate: React.FC = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  const { data: response, isLoading } = useGetOneSoldServicesQuery(id);

  const menuService = response?.soldServices;

  console.log(menuService);

  if (isLoading) return <Snipper />;
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black to-[#3a0d4e] text-gray-200 p-0">
      <div className="text-xl sm:text-4xl md:text-5xl font-extrabold text-white text-center mb-4 tracking-wide drop-shadow-md">
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString("Welcom To Bad Elhara")
              .pauseFor(2000)
              .deleteAll()
              .start();
          }}
          options={{
            loop: true,
            delay: 100,
          }}
        />
      </div>

      {menuService?.menuUpdatableContent?.length > 0 && (
        <div className="w-full flex items-center justify-center">
          <div className="w-[100%] ">
            <Swiper
              effect="cards"
              grabCursor={true}
              modules={[EffectCards]}
              style={{
                width: "100%",
                padding: "10px 30px",
                overflow: "hidden",
              }}
              className="w-[100%]  h-[90vh] rounded-xl overflow-hidden"
            >
              {menuService?.menuUpdatableContent.map(
                (image: string, index: number) => (
                  <SwiperSlide
                    key={index}
                    style={
                      {
                        // width: "fit-content",
                        // height: "100%",
                      }
                    }
                    className="aspect-[4/3] w-full flex items-center justify-center rounded-xl overflow-hidden shadow-lg border border-gray-700"
                  >
                    <img
                      src={image}
                      alt={`Menu Page ${index + 1}`}
                      // style={{ width: "100%" }}
                      className=" h-full object-cover w-full"
                      loading="lazy"
                    />
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuTemplate;
