import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { useNavigate } from "react-router-dom";
import { Command } from "lucide-react"

export default function Signup({ className, ...props }) {
  const signup_addr = "http://127.0.0.1:8000/users/signup";
  const navigate = useNavigate();

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

  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await axios.post(signup_addr, newUser);
      return response.data;
    },
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (data) => {
    const { confirm_password, ...userData } = data;
    mutation.mutate(userData);
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
                <BreadcrumbLink href="/">Vera</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Signup</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <div className={cn("flex flex-col gap-6", className)} {...props}>
              <Card>
                <CardHeader>
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Hi There!</h1>
                    <p className="text-muted-foreground text-balance">
                      Create A New Vera Account
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <form className="flex flex-col gap-4">
                    <div className="grid gap-3">
                      <Label>Username</Label>
                      <Input placeholder="Your username" />
                    </div>
                    <div className="grid gap-3">
                      <Label>Email</Label>
                      <Input type="email" placeholder="you@example.com" />
                    </div>
                    <div className="grid gap-3">
                      <Label>First Name</Label>
                      <Input placeholder="First Name" />
                    </div>
                    <div className="grid gap-3">
                      <Label>Last Name</Label>
                      <Input placeholder="Last Name" />
                    </div>
                    <div className="grid gap-3">
                      <Label>Password</Label>
                      <Input type="password" placeholder="Your password" />
                    </div>
                    <div className="grid gap-3">
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Sign Up
                    </Button>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or
                      </span>
                    </div>
                    
                    <div className="text-center text-sm mt-2">
                      Already have an account?{" "}
                      <a href="/login" className="underline underline-offset-4">
                        Login
                      </a>
                    </div>
                  </form>
                </CardContent>
              </Card>
              <div className="text-center text-xs text-muted-foreground mt-4">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
