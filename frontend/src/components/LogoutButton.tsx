import { logout } from "@/lib/api-client";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { clearUserData } = useAuth();
  const mutation = useMutation(logout, {
    onSuccess: () => {
      toast.success("Logged out");
      clearUserData();
      navigate("/");
    },
    onError: (error: Error) => {
      console.log(error);
      toast.error("Error", { description: error.message });
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };
  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
