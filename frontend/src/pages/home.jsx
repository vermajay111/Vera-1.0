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
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/utils/TokenRefresh";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HomePage() {
  const username = useSelector((state) => state.user.username);
  const first_name = useSelector((state) => state.user.first_name);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "http://127.0.0.1:8000/users/user_dashboard"
      );
      return res.data;
    },
  });

  if(!isLoading){
    console.log(data);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top Header */}
        <header
          className="sticky top-0 flex h-16 items-center gap-2 px-4 
             border-b border-gray-800 bg-black/40 backdrop-blur-md 
             z-40"
        >
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
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Dashboard Content */}
        {!isLoading ? (
          <div className="flex flex-col gap-6 p-6">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-purple-700/20 to-black border-purple-900/40 backdrop-blur-xl shadow-2xl rounded-3xl">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Welcome Back, {first_name}
                    </h1>

                    {data.stats.reliability_score_percent > 50 ? (
                      <p className="text-purple-300 mt-1">
                        You are becoming a product of your word. Keep it up!
                      </p>
                    ) : (
                      <p className="text-purple-300 mt-1">
                        We need to do some work on keeping your word... Lets
                        keep trying!
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-purple-400 text-sm">
                        Reliability score
                      </p>
                      <p className="text-4xl font-bold text-white">
                        {data.stats.reliability_score_percent}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Promises Carousel */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Active Promises
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {data.active_promises.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.03, rotate: 1 }}
                    className="min-w-[260px] bg-black/40 backdrop-blur-lg border border-purple-900/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="text-white font-semibold text-lg">
                        {item.title}
                      </h3>
                      <div className="flex justify-between items-center text-purple-300 text-sm">
                        <span>Due: Saturday</span>
                        <span>Stake: {item.stake_amount}</span>
                      </div>
                    </div>

                    <div className="w-full mt-2">
                      <div className="h-2 w-full bg-purple-900/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                          style={{
                            width: `${100 - item.time_remaining_percent}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="link"
                          className="text-white mt-2 hover:text-purple-400 text-sm"
                        >
                          Actions / Info
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{item.title}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {item.description}
                            Deadline: {item.resolution_date}
                            Completion requirement: {item.majority_vote ? <p>Majority vote will be needed to complete promise</p> : <p>All users need to accept the promise has been completed</p>}
                            <Button>Accept As Completed</Button>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Action Tiles */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Your Next Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Tile title="Pending Invitations" accent="border-blue-600/40" />

                <Tile
                  title="Confirm Today's Promise"
                  accent="border-purple-600/40"
                />
                <Link to="/start_new_promise">
                  <Tile
                    title="Start New Promise"
                    accent="border-yellow-600/40"
                  />
                </Link>
              </div>
            </section>

            {/* Stats Overview */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-black/30 border border-purple-900/40 backdrop-blur-xl shadow-xl">
                  <CardContent className="p-4">
                    <p className="text-purple-300 text-sm">Promises Started</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {data.stats.total_promises_started}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 border border-purple-900/40 backdrop-blur-xl shadow-xl">
                  <CardContent className="p-4">
                    <p className="text-purple-300 text-sm">
                      Promises Completed
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {data.stats.total_completed_promises}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 border border-purple-900/40 backdrop-blur-xl shadow-xl">
                  <CardContent className="p-4">
                    <p className="text-purple-300 text-sm">Tokens Remaning</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {data.stats.current_stake_balance}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 border border-purple-900/40 backdrop-blur-xl shadow-xl">
                  <CardContent className="p-4">
                    <p className="text-purple-300 text-sm">Promises Failed</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {data.stats.promises_failed}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/30 border border-purple-900/40 backdrop-blur-xl shadow-xl">
                  <CardContent className="p-4">
                    <p className="text-purple-300 text-sm">Promises Pending</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {data.active_promises.length}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        ) : (
          <div>
            <h1>Data is loading please wait...</h1>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}

function Tile({ title, accent }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`p-4 rounded-2xl bg-black/30 border ${accent} backdrop-blur-xl shadow-lg text-white cursor-pointer`}
    >
      <p className="font-semibold">{title}</p>
    </motion.div>
  );
}
