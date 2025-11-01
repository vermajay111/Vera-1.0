import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setCookieByMinutes } from "./cookieManager";
import Cookies from "js-cookie";

const ACCESS_EXPIRATION_MINUTES = 5; // short-lived
const REFRESH_EXPIRATION_MINUTES = 60 * 24; // 1 day (adjust to backend settings)

const REFRESH_TOKEN_EXPIRATION_BUFFER = 2 * 60 * 1000; // 2 minutes before expiry
const refresh_token_url = "http://127.0.0.1:8000/users/api/token/refresh/";

// Create axios instance
export const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get("access");
    const refreshToken = Cookies.get("refresh");

    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      const expirationTime = decoded.exp * 1000;

      // Check if access token is about to expire
      if (expirationTime - Date.now() < REFRESH_TOKEN_EXPIRATION_BUFFER) {
        try {
          const { access: newAccess, refresh: newRefresh } =
            await refreshTokenRequest(refreshToken);

          if (newAccess) {
            setCookieByMinutes("access", newAccess, ACCESS_EXPIRATION_MINUTES);
            config.headers.Authorization = `Bearer ${newAccess}`;
          }
          if (newRefresh) {
            setCookieByMinutes(
              "refresh",
              newRefresh,
              REFRESH_EXPIRATION_MINUTES
            );
          }
          return config;
        } catch (error) {
          console.error("Refresh token error:", error);
          return Promise.reject(error);
        }
      } else {
        // Token still valid
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } else if (refreshToken && !accessToken) {
      // Try to recover access token if only refresh is present
      try {
        const { access: newAccess, refresh: newRefresh } =
          await refreshTokenRequest(refreshToken);

        if (newAccess) {
          setCookieByMinutes("access", newAccess, ACCESS_EXPIRATION_MINUTES);
          config.headers.Authorization = `Bearer ${newAccess}`;
        }
        if (newRefresh) {
          setCookieByMinutes("refresh", newRefresh, REFRESH_EXPIRATION_MINUTES);
        }
        return config;
      } catch (error) {
        console.error("Refresh token error:", error);
        return Promise.reject(error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Helper for refreshing tokens
async function refreshTokenRequest(refreshToken) {
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(refresh_token_url, {
    refresh: refreshToken,
  });

  // ✅ Handle both tokens if backend rotates them
  return {
    access: response.data.access,
    refresh: response.data.refresh,
  };
}
