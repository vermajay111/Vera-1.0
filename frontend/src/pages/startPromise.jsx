import { useState } from "react";
import { useFriendsSearch } from "@/hooks/useFriendsSearch";
import { AppSidebar } from "../components/custom/navbar/app-sidebar";

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

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/TokenRefresh";

export function CreatePromise() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [stake, setStake] = useState("");
  const [majorityVote, setMajorityVote] = useState(true);

  const { data: friends = [], isLoading } = useFriendsSearch(search);

  const toggleFriend = (id) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Mutation to create a promise
  const mutation = useMutation({
    mutationFn: async (newPromise) => {
      const response = await axiosInstance.post(
        "http://127.0.0.1:8000/promises/send/",
        newPromise
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Promise created:", data);
    },
    onError: (error) => {
      console.error("Failed to create promise:", error);
    },
  });

  const handleCreatePromise = () => {
    const payload = {
      title: title,
      receiver_ids: selectedFriends, 
      description: description, 
      resolution_date: date, 
      majority_vote: majorityVote, // boolean
      stake_amount: Number(stake) || 0, // number
    };
    console.log(payload)
    mutation.mutate(payload);
  };


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen">
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 z-10 bg-black/70 backdrop-blur-md">
          <SidebarTrigger className="-ml-1 text-purple-400" />
          <Separator
            orientation="vertical"
            className="mr-2 h-4 border-gray-700"
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
                  Start Promise
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-black">
          <Card className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Create a New Promise
              </h1>
              <p className="text-gray-400">
                Fill in the details below to start a new promise with friends
              </p>
            </div>

            {/* FORM FIELDS */}
            <div className="grid gap-2">
              <Label className="text-gray-300">Promise Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter promise title..."
                className="bg-black/30 border-gray-700 focus:ring-purple-500 text-white placeholder-gray-500"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the promise..."
                rows={3}
                className="bg-black/30 border-gray-700 focus:ring-purple-500 text-white placeholder-gray-500"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-gray-300">Invite Members</Label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search friends..."
                className="bg-black/30 border-gray-700 focus:ring-purple-500 text-white placeholder-gray-500"
              />

              <div className="max-h-56 overflow-y-auto mt-2 border border-gray-700 rounded-xl p-2 space-y-1 bg-black/30">
                {isLoading && (
                  <p className="text-center text-sm text-gray-400 py-2">
                    Loading friends...
                  </p>
                )}
                {!isLoading &&
                  friends.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => toggleFriend(f.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-purple-900/30 transition-colors ${
                        selectedFriends.includes(f.id) ? "bg-purple-900/20" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={f.avatar || f.default_avatar}
                          alt={f.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-medium text-sm">
                            {f.first_name} {f.last_name}
                          </p>
                          <p className="text-gray-400 text-xs">@{f.username}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedFriends.includes(f.id)}
                        readOnly
                        className="accent-purple-500 w-4 h-4"
                      />
                    </div>
                  ))}
              </div>

              {selectedFriends.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedFriends.map((id) => {
                    const friend = friends.find((f) => f.id === id);
                    if (!friend) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-800/20 border border-purple-700 rounded-full text-sm"
                      >
                        <img
                          src={friend.avatar || friend.default_avatar}
                          className="w-5 h-5 rounded-full"
                          alt={friend.username}
                        />
                        <span className="text-white">{friend.first_name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-gray-300">Resolution Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-black/30 border-gray-700 focus:ring-purple-500 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-300">Time</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-black/30 border-gray-700 focus:ring-purple-500 text-white"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-gray-300">Stake Amount</Label>
              <Input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="Enter amount..."
                className="bg-black/30 border-gray-700 focus:ring-purple-500 text-white"
              />
            </div>

            {/* VOTING MODE */}
            <TooltipProvider>
              <div className="flex items-center gap-2 mt-4">
                <Switch
                  id="vote-mode"
                  checked={majorityVote}
                  onCheckedChange={setMajorityVote}
                />
                <Label htmlFor="vote-mode" className="text-gray-300">
                  {majorityVote ? "Majority Vote" : "All Vote"}
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-2 cursor-pointer">
                      <Info className="w-4 h-4 text-gray-400 hover:text-purple-300" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 text-gray-200 border border-gray-700 shadow-lg rounded-md p-2 max-w-xs">
                    <p className="text-sm">
                      <strong>Majority Vote:</strong> Promise resolves if more
                      than 50% of participants confirm.
                      <br />
                      <strong>All Vote:</strong> Promise resolves only if all
                      participants confirm.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <Button
              onClick={handleCreatePromise}
              disabled={mutation.isLoading}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white shadow-lg shadow-purple-900/40 rounded-xl py-4 mt-4"
            >
              {mutation.isLoading ? "Creating..." : "Create Promise"}
            </Button>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
