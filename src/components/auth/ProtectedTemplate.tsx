import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useGetClientInfoQuery } from "../../store/apiSlice/AuthSlice";
import toast from "react-hot-toast";
import { ReactNode, useEffect } from "react";

interface ProtectedTemplateProps {
  children?: ReactNode;
}

const ProtectedTemplate: React.FC<ProtectedTemplateProps> = ({ children }) => {
  const { data, isLoading, isError, error } = useGetClientInfoQuery(undefined);

  const [searchParams] = useSearchParams();
  const soldId = Number(searchParams.get("id"));

  const targeted_sold_service = data?.user?.soldServices?.find(
    (ele: any) => ele?.id === soldId
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!data?.user) {
      toast("Signup first");
      navigate("/signup");
      return;
    }

    if (!targeted_sold_service?.type) {
      if (data.user.soldServices.length > 0) {
        toast("You aren't allowed");

        navigate("/client-dashboard");
        return;
      } else {
        navigate("/signin");
      }
    }
  }, [data?.user, targeted_sold_service, navigate, error, soldId]);
  console.log(error);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedTemplate;
