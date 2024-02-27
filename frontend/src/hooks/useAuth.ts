import { useQuery, useQueryClient } from "react-query";
import { getUser } from "@/lib/api-client";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery("user", getUser);
  const clearUserData = () => {
    queryClient.invalidateQueries("user");
    queryClient.setQueryData("user", null);
  };

  if (!user) {
    queryClient.setQueryData("user", null);
  }

  return { user, isLoading, isError, clearUserData };
};
