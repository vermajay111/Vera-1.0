import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { AppSidebar } from "@/components/custom/navbar/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { setCookieByMinutes, setCookieByDays } from "@/utils/cookieManager";
import { token_refresh } from "@/slices/TokenSlice";
import { user_refresh } from "@/slices/UserSlice";

export default function Signup({ className, ...props }) {
  const signupUrl = "http://127.0.0.1:8000/users/signup";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");

  // --- Validation schema ---
  const schema = yup.object().shape({
    username: yup.string().max(30).required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    password: yup.string().min(6).required("Password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // --- Signup Mutation ---
  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await axios.post(signupUrl, newUser);
      return response.data;
    },
    onSuccess: (data, variables) => {
      setServerError("");
      setCookieByMinutes("access", data.access, 5);
      setCookieByDays("refresh", data.refresh, 7);
      setCookieByDays("username", variables.username, 7);
      dispatch(user_refresh());
      dispatch(token_refresh());
      navigate("/home");
    },
    onError: (error) => {
      if (error.response?.data) {
        const data = error.response.data;
        if (data.username) setServerError("Username already taken.");
        else if (data.email)
          setServerError("Email already registered. Try another.");
        else setServerError("Signup failed. Try again.");
      } else {
        setServerError("Network error. Try again.");
      }
    },
  });

  const onSubmit = (data) => {
    const { confirm_password, ...userData } = data;
    mutation.mutate(userData);
  };

  // ------------------------------------------------------------------------------

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {/* HEADER / BREADCRUMB */}
        <header className="flex h-16 items-center gap-2 border-b px-4 bg-black/40 backdrop-blur-md">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6 mx-2" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Vera</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Signup</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-black via-[#0a0710] to-black">
          <div className="w-full max-w-md">
            <div className={cn("flex flex-col gap-6", className)} {...props}>
              <Card className="bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
                <CardHeader className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-white tracking-wide">
                    Create Your Account
                  </h1>
                  <p className="text-sm text-purple-300/80">
                    Join Vera and start your journey
                  </p>
                </CardHeader>

                <CardContent>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    {[
                      { label: "Username", name: "username", type: "text" },
                      { label: "Email", name: "email", type: "email" },
                      { label: "First Name", name: "first_name", type: "text" },
                      { label: "Last Name", name: "last_name", type: "text" },
                      { label: "Password", name: "password", type: "password" },
                      {
                        label: "Confirm Password",
                        name: "confirm_password",
                        type: "password",
                      },
                    ].map(({ label, name, type }) => (
                      <div className="grid gap-2" key={name}>
                        <Label className="text-purple-200">{label}</Label>
                        <Input
                          type={type}
                          placeholder={label}
                          className="bg-black/40 border-white/10 text-white placeholder:text-purple-300/40 focus-visible:ring-purple-500"
                          {...register(name)}
                        />
                        {errors[name] && (
                          <span className="text-red-400 text-sm">
                            {errors[name]?.message}
                          </span>
                        )}
                      </div>
                    ))}

                    <Button
                      type="submit"
                      className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-700/30"
                    >
                      Sign Up
                    </Button>
                  </form>

                  {serverError && (
                    <div className="mt-3 text-red-400 text-center text-sm">
                      {serverError}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="text-center text-xs text-purple-300/70 mt-4">
                By continuing, you agree to our{" "}
                <a href="#" className="underline text-purple-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline text-purple-300">
                  Privacy Policy
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
