import { useSearchParams } from "react-router-dom";
import VCardTemplatesComponent from "../components/templates/VCardTemplatesComponent";
import MenuTemplatesComponent from "../components/templates/MenuTemplatesComponent";

const SelectTemplate = () => {
  const [searchParams] = useSearchParams();

  const param = searchParams.get("service-type");

  console.log(param);

  return (
    <>
      {param === "vCard" && <VCardTemplatesComponent />}
      {param === "menu" && <MenuTemplatesComponent />}
    </>
  );
};

export default SelectTemplate;
