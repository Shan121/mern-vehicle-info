import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading, isError } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default UserRoute;
