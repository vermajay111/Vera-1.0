import React from "react";
import { motion } from "framer-motion";
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
import { AppSidebar } from "../components/custom/navbar/app-sidebar";
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/TokenRefresh";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

export default function UserProfilePage() {
  const { id } = useParams();
  const userId = useSelector((state) => state.user.user_id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userprofile-lookup", id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/users/user_profile`,
        { params: { id } }
      );
      return response.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-white bg-black">
        Loading user profile...
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 bg-black">
        Error fetching user profile.
      </div>
    );

  const user = data.user;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black/70">
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur-md bg-black/30">
          <SidebarTrigger className="-ml-1 text-purple-400" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 border-gray-700"
          />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/" className="text-purple-300">
                  Vera
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-gray-500" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-300">
                  @{user.username}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* MAIN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col items-center gap-8 p-6 sm:p-10"
        >
          {/* PROFILE CARD */}
          <Card className="w-full max-w-5xl bg-purple-900/30 backdrop-blur-xl border border-purple-700 rounded-3xl shadow-2xl p-8 sm:p-12 hover:shadow-purple-600/50 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* AVATAR */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 relative"
              >
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-purple-500 object-cover shadow-2xl"
                />
                <div className="absolute -bottom-2 right-0 w-6 h-6 bg-purple-600 rounded-full border-2 border-white animate-pulse" />
              </motion.div>

              {/* USER INFO */}
              <div className="flex-1 flex flex-col gap-3">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
                  @{user.username}
                </h1>
                <p className="text-gray-300 text-xl">
                  {user.first_name} {user.last_name}
                </p>
                {user.bio && (
                  <p className="text-gray-200 text-lg italic">{user.bio}</p>
                )}
                <p className="text-gray-400 text-sm mt-1">
                  Account Created:{" "}
                  {new Date(user.account_created).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              {[
                { value: user.num_friends, label: "Friends" },
                { value: user.promises_completed, label: "Promises Completed" },
                { value: user.promises_failed, label: "Promises Failed" },
                { value: user.reliability_score, label: "Reliability Score" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-purple-800/40 border border-purple-600 rounded-2xl p-6 text-center shadow-lg text-white transition-all duration-300"
                >
                  <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                  <p className="text-gray-300 text-sm mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* ACTION BUTTON */}
            <div className="flex justify-center mt-12">
              {!(userId == id) && (
                <Button className="bg-purple-600 hover:bg-purple-500 text-white py-3 px-10 rounded-2xl shadow-lg text-lg transition-all duration-300">
                  Add Friend
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  );
}
