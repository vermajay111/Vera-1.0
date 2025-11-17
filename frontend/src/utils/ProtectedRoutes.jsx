import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export default function ProtectRoute({ children }) {
  const refreshToken = useSelector((state) => state.token.refresh);
  const navigate = useNavigate();

  useEffect(() => {
    if (!refreshToken) {
      const timer = setTimeout(() => {
        toast.error("You need to log in to view this page", {
          description: (
            <span style={{ color: "#ddd" }}>Please log in to continue.</span>
          ),
          action: {
            label: "Login",
            onClick: () => navigate("/login"),
          },
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [refreshToken]);

  if (refreshToken) return children;

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col justify-center items-center p-6 z-50">
      <div className="max-w-md w-full bg-black/50 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-900/20 border border-purple-700 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-purple-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2v6m0-10a4 4 0 104 4H6a4 4 0 104-4z"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          You need to log in
        </h1>
        <p className="text-gray-300 text-sm sm:text-base">
          Please log in to access this page and continue using Vera features.
        </p>

        <Button
          asChild
          className="w-full sm:w-auto bg-purple-600/60 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-700/30 transition-all duration-300"
        >
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
