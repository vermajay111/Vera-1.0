import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export default function ProtectRoute({ children }) {
  const refreshToken = useSelector((state) => state.token.refresh);
  const navgiate = useNavigate();

  useEffect(() => {
    if (!refreshToken) {
      const timer = setTimeout(() => {
        toast.error("You need to log in to view this page", {
          description: (
            <span style={{ color: "#222" }}>Please log in to continue.</span>
          ),
          action: {
            label: "Login",
            onClick: () => navgiate('/login')
          },
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [refreshToken]);

  if (refreshToken) return children;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center p-6 z-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          You need to log in to view this page
        </h1>
        <p className="text-gray-600 mb-6">
          Please log in to access this feature.
        </p>
        <Button asChild>
          <Link to="/login" className="w-full justify-center">
            Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
