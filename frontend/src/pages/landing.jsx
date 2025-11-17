import React from "react";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/custom/navbar/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Handshake, ChartBarBig, VoteIcon } from "lucide-react";
import {Link} from "react-router-dom"
export default function Landing() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {/* Header with SidebarTrigger + Breadcrumb */}
        <header className="flex h-16 items-center gap-2 px-4 border-b border-gray-800 bg-black/40 backdrop-blur-md z-10">
          <SidebarTrigger className="-ml-1 text-purple-300" />
          <Separator orientation="vertical" className="mr-2 h-6 bg-gray-700" />

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

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden md:inline text-sm text-gray-400">
              Built for accountability • Dark mode
            </span>
            <Button
              size="sm"
              className="hidden md:inline bg-purple-700 hover:bg-purple-600"
            >
              Get Started
            </Button>
          </div>
        </header>

        {/* MAIN HERO */}
        <main className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-black via-[#0a0710] to-black text-white overflow-x-hidden">
          <section className="max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* LEFT: copy */}
              <div className="lg:col-span-6 space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
                >
                  Become a{" "}
                  <span className="text-purple-400">Product of Your Word</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-lg text-zinc-300 max-w-2xl"
                >
                  Vera turns promises into meaningful commitments — stake in-app
                  currency, confirm completion with friends, and track your
                  reliability over time.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  <Button
                    size="lg"
                    className="px-8 py-5 rounded-2xl bg-purple-600 hover:bg-purple-500"
                  >
                    <Link to="/start_new_promise">Create a Promise</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-5 rounded-2xl border-gray-700"
                  >
                    Watch Demo
                  </Button>
                </motion.div>

                <div className="mt-6 flex gap-6 flex-wrap items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-800/20 flex items-center justify-center border border-purple-700">
                      <Users className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-300 font-medium">
                        Social
                      </div>
                      <div className="text-xs text-gray-400">
                        Invite friends and form trusted groups
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-800/20 flex items-center justify-center border border-purple-700">
                      <Handshake className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-300 font-medium">
                        Stakes
                      </div>
                      <div className="text-xs text-gray-400">
                        Make promises meaningful with in-app currency
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-800/20 flex items-center justify-center border border-purple-700">
                      <ChartBarBig className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-300 font-medium">
                        Track Progress
                      </div>
                      <div className="text-xs text-gray-400">
                        See completed promises and measure reliability
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: 3D mockup */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end">
                <motion.div
                  initial={{ opacity: 0, rotateY: -12, y: 20 }}
                  animate={{ opacity: 1, rotateY: 0, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative w-full max-w-md"
                >
                  {/* glowing orb */}
                  <div className="absolute -left-24 -top-24 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

                  {/* 3D card stack */}
                  <div className="perspective-800">
                    <motion.div
                      whileHover={{ rotateY: 6, rotateX: -4, scale: 1.02 }}
                      className="transform-style-preserve w-full"
                    >
                      <div className="relative">
                        {/* back card */}
                        <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-zinc-900/60 to-zinc-800/60 border border-zinc-700 shadow-2xl transform translate-y-6 rotate-2" />

                        {/* middle card */}
                        <div className="absolute -inset-2 -z-5 rounded-2xl bg-gradient-to-br from-black/60 to-zinc-900/50 border border-zinc-700 shadow-2xl transform translate-y-3 rotate-1" />

                        {/* top interactive card */}
                        <div className="relative rounded-2xl bg-gradient-to-br from-black/40 to-zinc-900/30 border border-white/6 shadow-2xl overflow-hidden">
                          <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-purple-300 font-semibold">
                                  Promise
                                </div>
                                <div className="mt-2 text-lg font-semibold">
                                  Go to the park — Sat 10am
                                </div>
                                <div className="mt-1 text-xs text-gray-400">
                                  3 friends invited • 20 $V
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="text-xs text-gray-400">
                                  Status
                                </div>
                                <div className="mt-1 text-sm text-green-300 font-medium">
                                  Active
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                              <div className="text-center">
                                <div className="text-sm text-zinc-300 font-medium">
                                  Completed
                                </div>
                                <div className="mt-1 text-xl font-semibold">
                                  12
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-zinc-300 font-medium">
                                  Reputation
                                </div>
                                <div className="mt-1 text-xl font-semibold text-purple-300">
                                  4.7
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                              <Button className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500">
                                Join
                              </Button>
                              <Button
                                variant="outline"
                                className="py-2 rounded-lg border-gray-700"
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Features grid */}
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Group Accountability",
                  desc: "Friends confirm completion together using voting.",
                  icon: Handshake,
                },
                {
                  title: "Majority or All",
                  desc: "Choose if everyone must agree, or just most of the group.",
                  icon: VoteIcon,
                },
                {
                  title: "Stakes & Rewards",
                  desc: "Stake in-app currency to make promises meaningful.",
                  icon: Sparkles,
                },
                {
                  title: "Track Progress",
                  desc: "View completed promises and build reliability over time.",
                  icon: Users,
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-800/20 border border-purple-700 flex items-center justify-center">
                      <f.icon className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{f.title}</div>
                      <div className="mt-1 text-sm text-gray-400">{f.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-20 text-center">
              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold"
              >
                Ready to make promises matter?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gray-300 max-w-2xl mx-auto mt-3"
              >
                Join Vera to turn trust into trackable commitments — your
                reliability follows your word.
              </motion.p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-500"
                >
                  Join Vera
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 border-gray-700"
                >
                  Explore Features
                </Button>
              </div>
            </div>
          </section>

          <div className="h-24" />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
