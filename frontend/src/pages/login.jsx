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
import loginImg from "../assets/images/login.jpeg";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { setCookieByDays, setCookieByMinutes } from "@/utils/cookieManager";
import { token_refresh } from "@/slices/TokenSlice";
import { user_refresh } from "@/slices/UserSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
      setCookieByDays("username", variables.username, 7);
      dispatch(user_refresh());
      dispatch(token_refresh());
      //toast.success("Successfully Logged In!");
      navigate("/home");
    },
    onError: (error) => {
      console.log(error);
      //toast.error("There was an error logging in! This account may not exist!");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Checkup</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Login</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            {" "}
            {/* Removed md:max-w-3xl */}
            <div className={cn("flex flex-col gap-6", className)} {...props}>
              <Card className="overflow-hidden p-0">
                <CardContent className="p-6 md:p-8">
                  {" "}
                  {/* Removed grid and md:grid-cols-2 */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Welcome back</h1>
                      <p className="text-muted-foreground text-balance">
                        Login to your Vera account
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="username"
                        {...register("username")}
                        required
                        disabled={mutation.isPending}
                      />
                    </div>

                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>

                      <Input
                        id="password"
                        type="password"
                        placeholder="Your 8 character password"
                        {...register("password")}
                        required
                        disabled={mutation.isPending}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={mutation.isPending}
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

                    {mutation.isError && (
                      <p className="text-red-500 ml-3">
                        Username or password is incorrect, please try again!
                      </p>
                    )}

                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or
                      </span>
                    </div>

                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <a
                        href="/signup"
                        className="underline underline-offset-4"
                      >
                        Sign up
                      </a>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
