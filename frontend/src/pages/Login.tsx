"use client";

import { useEffect, useState } from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { LoginSchema } from "@/lib/schemas";
import { ClipLoader } from "react-spinners";
import { useMutation, useQueryClient } from "react-query";
import { login } from "@/lib/api-client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser, isLoading:loading } = useAuth();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate("/submit-vehicle-info", { replace: true });
    }
  }, [currentUser, navigate, loading]);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const { mutate, isLoading } = useMutation(login, {
    onSuccess: async () => {
      console.log("user logged in");
      toast.success("Success", { description: "User logged in" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/submit-vehicle-info");
    },
    onError: (error: Error) => {
      console.log(error);
      toast.error("Error", { description: error.message });
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    mutate(values);
  };

  return (
    <div className="h-[50vh] md:h-[75vh] flex items-center justify-center">
      <div className="w-11/12 md:w-2/5 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold mt-4 mb-8">Log In</span>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-2">
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading || isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div>
                        <FormControl>
                          <div className="flex items-center relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              disabled={isLoading || isSubmitting}
                            />
                            <div className="absolute right-2">
                              {showPassword ? (
                                <EyeOff
                                  onClick={() => setShowPassword((v) => !v)}
                                  color="gray"
                                  className="cursor-pointer hover:bg-slate-200 rounded-lg"
                                />
                              ) : (
                                <Eye
                                  onClick={() => setShowPassword((v) => !v)}
                                  color="gray"
                                  className="cursor-pointer hover:bg-slate-200 rounded-lg"
                                />
                              )}
                            </div>
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            </div>
            <Button
              type="submit"
              className="w-full mt-5 relative"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center gap-1">
                  <ClipLoader size={20} />
                </div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
