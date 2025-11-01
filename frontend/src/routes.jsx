import { Route, Routes } from "react-router-dom";
import ProtectRoute from "./utils/ProtectedRoutes";
import  Login  from "./pages/login";
import { Home } from "./pages/home";

import Signup from "./pages/signup";
//import { LogOut } from "./pages/logout";

export const router = (
  <Routes>
    <Route
      path="/infrence"
      element={
        <ProtectRoute>
          <Home />
        </ProtectRoute>
      }
    />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/home" element={<Home />} />
    <Route path="/" element={<Home />} />
    <Route path="*" element={<p>404 not found</p>} />
  </Routes>
);
