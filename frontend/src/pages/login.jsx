import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppSidebar } from "@/components/custom/navbar/app-sidebar";
import axios from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { setCookieByDays, setCookieByMinutes } from "@/utils/cookieManager";
import { token_refresh } from "@/slices/TokenSlice";
import { user_refresh } from "@/slices/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

export default function Login({ className, ...props }) {
  const login_addr = "http://127.0.0.1:8000/users/login";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup.string().max(30).required("Username is required"),
    password: yup.string().min(6).max(20).required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const mutation = useMutation({
    mutationFn: async (UserCred) => {
      const response = await axios.post(login_addr, UserCred);
      return response.data;
    },
    onSuccess: (data, variables) => {
      setCookieByMinutes("access", data.access, 5);
      setCookieByDays("refresh", data.refresh, 7);
      setCookieByDays("username", variables.username, 7);
      dispatch(user_refresh());
      dispatch(token_refresh());
      navigate("/home");
    },
    onError: () => {},
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 px-4 bg-black/40 backdrop-blur-md">
          <SidebarTrigger className="-ml-1 text-purple-300" />

          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 bg-gray-700"
          />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/" className="text-purple-300">
                  Vera
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-gray-600" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-300">Login</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* MAIN */}
        <div
          className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 
        bg-gradient-to-b from-black via-[#0a0710] to-black"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className={cn("flex flex-col gap-6", className)} {...props}>
              {/* GLASS CARD */}
              <Card className="bg-black/50 border border-white/10 shadow-2xl rounded-2xl backdrop-blur-xl">
                <CardContent className="p-6 md:p-8">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    {/* HEADING */}
                    <div className="flex flex-col items-center text-center space-y-1">
                      <h1 className="text-3xl font-bold text-white tracking-tight">
                        Welcome back
                      </h1>
                      <p className="text-purple-300/70 text-sm">
                        Login to your Vera account
                      </p>
                    </div>

                    {/* USERNAME */}
                    <div className="grid gap-3">
                      <Label htmlFor="username" className="text-purple-200">
                        Username
                      </Label>

                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        className="bg-black/40 border-white/10 text-white placeholder-purple-300/40 
                        focus-visible:ring-purple-600"
                        {...register("username")}
                        disabled={mutation.isPending}
                      />

                      {errors.username && (
                        <p className="text-red-400 text-sm">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    {/* PASSWORD */}
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password" className="text-purple-200">
                          Password
                        </Label>
                        <a
                          href="#"
                          className="ml-auto text-sm text-purple-300 hover:text-purple-200"
                        >
                          Forgot your password?
                        </a>
                      </div>

                      <Input
                        id="password"
                        type="password"
                        placeholder="Your secure password"
                        className="bg-black/40 border-white/10 text-white placeholder-purple-300/40
                        focus-visible:ring-purple-600"
                        {...register("password")}
                        disabled={mutation.isPending}
                      />

                      {errors.password && (
                        <p className="text-red-400 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* LOGIN BUTTON */}
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold 
                      shadow-lg shadow-purple-700/30"
                    >
                      {mutation.isPending ? (
                        <div className="flex justify-center gap-1">
                          <span className="animate-bounce [animation-delay:-0.3s]">
                            .
                          </span>
                          <span className="animate-bounce [animation-delay:-0.15s]">
                            .
                          </span>
                          <span className="animate-bounce">.</span>
                        </div>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    {/* ERROR MSG */}
                    {mutation.isError && (
                      <p className="text-red-400 text-sm text-center">
                        Invalid username or password.
                      </p>
                    )}

                    {/* DIVIDER */}
                    <div className="relative text-center text-sm text-purple-300/50">
                      <span className="px-2 bg-black">or</span>
                      <div className="absolute left-0 top-1/2 w-full border-t border-gray-700 -z-10"></div>
                    </div>

                    {/* SIGNUP LINK */}
                    <div className="text-center text-sm text-purple-200">
                      Don’t have an account?{" "}
                      <a
                        href="/signup"
                        className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
                      >
                        Sign up
                      </a>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="text-purple-300/70 text-center text-xs mt-2">
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Privacy Policy
                </a>
                .
              </div>
            </div>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
