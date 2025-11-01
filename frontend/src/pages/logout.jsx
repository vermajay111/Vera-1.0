import { axiosInstance } from "@/utils/TokenRefresh";
import { useMutation } from "@tanstack/react-query";
import LoadingScreen from "@/components/custom/load/loadingScreen";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { token_refresh } from "@/slices/TokenSlice";
import { user_refresh } from "@/slices/UserSlice";
import Sidebar from "@/components/custom/sidebar/sidebar";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { LogOutIcon, HomeIcon, LogInIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Logout() {
  const refresh_token = useSelector((state) => state.token.refresh);

  const dispatch = useDispatch();
  const global_http = "http://127.0.0.1:8000";
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        global_http + "/users/logout",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      Cookies.remove("access");
      Cookies.remove("refresh");
      Cookies.remove("username");
      dispatch(user_refresh());
      dispatch(token_refresh());
      toast.success("Successfully Logged Out!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error logging out");
    },
  });

  useEffect(() => {
    const post_data = { refresh: refresh_token };
    mutation.mutate(post_data);
  }, []);

  return (
    <Sidebar>
      <div className="flex items-center justify-center min-h-screen">
        {mutation.isPending ? (
          <LoadingScreen />
        ) : (
          <div className="flex flex-col items-center space-y-8 bg-gray-900 p-8 shadow-lg rounded-lg max-w-lg text-white">
            <LogOutIcon className="w-16 h-16 text-red-400" />
            <h1 className="text-3xl font-bold text-white">
              Successfully Logged Out!
            </h1>
            <p className="text-lg text-gray-300">
              You have been logged out of your account. We hope to see you again
              soon!
            </p>
            <div className="flex space-x-4">
              <Button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-500"
              >
                <LogInIcon className="w-5 h-5" />
                <span>Login Again</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/home")}
                className="flex items-center space-x-2 border border-white text-white hover:bg-gray-700"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Go to Home</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
