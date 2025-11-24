import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { axiosInstance } from "@/utils/TokenRefresh";
import { token_refresh } from "@/slices/TokenSlice";
import { user_refresh } from "@/slices/UserSlice";

import { AppSidebar } from "@/components/custom/navbar/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { LogOutIcon, LogInIcon, HomeIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Logout() {
  const refresh_token = useSelector((state) => state.token.refresh);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        "http://127.0.0.1:8000/users/logout",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      Cookies.remove("access");
      Cookies.remove("refresh");
      Cookies.remove("username");
      Cookies.remove("first_name");
      Cookies.remove("last_name");
      Cookies.remove("email");
      Cookies.remove("user_id");
      Cookies.remove("profile_photo");
      Cookies.remove("bio");
      Cookies.remove("tokenCount");
      Cookies.remove("unread_notifications");
      dispatch(user_refresh());
      dispatch(token_refresh());
    },
    onError: () => {
      Cookies.remove("access");
      Cookies.remove("refresh");
      Cookies.remove("username");
      Cookies.remove("first_name");
      Cookies.remove("last_name");
      Cookies.remove("email");
      Cookies.remove("user_id");
      Cookies.remove("profile_photo");
      Cookies.remove("bio");
      Cookies.remove("tokenCount");
      Cookies.remove("unread_notifications");
      dispatch(user_refresh());
      dispatch(token_refresh());
    },
  });

  useEffect(() => {
    mutation.mutate({ refresh: refresh_token });
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen flex flex-col bg-black/90 text-white">
        {/* HEADER */}
        <header className="flex h-16 items-center gap-2 border-b border-gray-800 px-4 bg-black/40 backdrop-blur-md">
          <SidebarTrigger className="-ml-1 text-purple-300" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-gray-700" />
          <h2 className="text-white font-semibold">Logout</h2>
        </header>

        {/* MAIN */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div
              className={`flex flex-col items-center text-center space-y-6
              bg-black/50 border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-xl`}
            >
              {/* ICON */}
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-purple-900/20 border border-purple-700 shadow-lg">
                <LogOutIcon className="w-12 h-12 text-purple-300 animate-pulse" />
              </div>

              {/* TEXT */}
              <h1 className="text-3xl font-bold text-white">Logged Out</h1>
              <p className="text-gray-300 text-base leading-relaxed">
                You have successfully logged out of your Vera account.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
                <Button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-purple-600/60 hover:bg-purple-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-purple-700/30 transition-all duration-300"
                >
                  <LogInIcon className="w-5 h-5" />
                  Login Again
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/home")}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto border border-purple-700 text-purple-300 font-semibold py-4 rounded-xl hover:bg-purple-900/20 hover:text-white transition-all duration-300"
                >
                  <HomeIcon className="w-5 h-5" />
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
