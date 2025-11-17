import { Route, Routes } from "react-router-dom";
import ProtectRoute from "./utils/ProtectedRoutes";
import Login from "./pages/login";
import HomePage from "./pages/home";
import Logout from "./pages/logout";
import Landing from "./pages/landing";
import Signup from "./pages/signup";
import UserProfilePage from "./pages/userProfile";
import { CreatePromise } from "./pages/startPromise";

export const router = (
  <Routes>
    <Route path="*" element={<p>404 not found</p>} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Landing />} />
    <Route path="/logout" element={<Logout />} />

    <Route
      path="/home"
      element={
        <ProtectRoute>
          <HomePage />
        </ProtectRoute>
      }
    />
    <Route
      path="/user_profile_page/:id"
      element={
        <ProtectRoute>
          <UserProfilePage />
        </ProtectRoute>
      }
    />
    <Route
      path="/start_new_promise"
      element={
        <ProtectRoute>
          <CreatePromise />
        </ProtectRoute>
      }
    />
  </Routes>
);
