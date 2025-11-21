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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function HomePage() {
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
                    Welcome Back, Alex
                  </h1>
                  <p className="text-purple-300 mt-1">
                    You're becoming a product of your word.
                  </p>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-purple-400 text-sm">Reliability</p>
                    <p className="text-4xl font-bold text-white">92%</p>
                  </div>

                  <div className="text-center">
                    <p className="text-purple-400 text-sm">Streak</p>
                    <p className="text-4xl font-bold text-white">7🔥</p>
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
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.03, rotate: 1 }}
                  className="min-w-[260px] bg-black/40 backdrop-blur-lg border border-purple-900/30 rounded-2xl p-4 shadow-lg"
                >
                  <h3 className="text-white font-semibold">
                    Park Visit Challenge
                  </h3>
                  <p className="text-purple-300 text-sm mt-1">
                    Due: Saturday • Stake: 20
                  </p>
                  <div className="h-2 w-full bg-purple-900/30 rounded-full mt-3">
                    <div className="h-full bg-purple-500/90 rounded-full w-1/2"></div>
                  </div>
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
              <Tile
                title="Friends You Completed With"
                accent="border-teal-600/40"
              />
              <Tile title="Start New Promise" accent="border-yellow-600/40" />
            </div>
          </section>

          {/* Stats Overview */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Completed Promises",
                "Conflicts Resolved",
                "Tokens Returned",
              ].map((label, i) => (
                <Card
                  key={i}
                  className="bg-black/30 border border-purple-900/40 backdrop-blur-xl shadow-xl"
                >
                  <CardContent className="p-4">
                    <p className="text-purple-300 text-sm">{label}</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {Math.floor(Math.random() * 40)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
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
