import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/TokenRefresh";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, UserCheck, UserX } from "lucide-react"; // example icons
import { toast } from "sonner";

export function useNotificationActions() {
  const queryClient = useQueryClient();

  const acceptFriendRequest = useMutation({
    mutationFn: ({ id, info }) =>
      axiosInstance.post(
        `http://127.0.0.1:8000/users/respond_to_friendrequest`,
        {
          notification_id: id,
          action: "accept",
        }
      ),
    onSuccess: (_data, variables) => {
      toast(`You are now friends with: ${variables.info}`);
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["friends"]);
    },
  });

  const declineFriendRequest = useMutation({
    mutationFn: ({ id, info }) =>
      axiosInstance.post(
        `http://127.0.0.1:8000/users/respond_to_friendrequest`,
        {
          notification_id: id,
          action: "reject",
        }
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(["notifications"]);
      toast(`You rejected: ${variables.info}'s friend request`);
    },
  });

  // Define rules for each notification "type"
  const notificationTypeMap = [
    {
      matcher: (msg) => msg.toLowerCase().includes("friend request"),
      icon: Heart,
      actions: {
        accept: (id) => acceptFriendRequest.mutate(id),
        decline: (id) => declineFriendRequest.mutate(id),
      },
    },
    {
      matcher: (msg) => msg.toLowerCase().includes("promise request"),
      icon: UserCheck,
      actions: {
        accept: (id) => console.log("Accept promise request", id),
        decline: (id) => console.log("Decline promise request", id),
      },
    },
  ];

  return notificationTypeMap;
}

function sortNotifications(notifications) {
  return notifications.sort((a, b) => {
    if (a.read !== b.read) return a.read - b.read;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

const fetchNotifications = async () => {
  const { data } = await axiosInstance.get(
    "http://127.0.0.1:8000/users/see_my_notifcations"
  );
  return sortNotifications(data);
};

export function Notifcations({ children }) {
  const {
    data: results = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 15000,
  });

  const typeMap = useNotificationActions();

  const getTypeData = (msg) =>
    typeMap.find((t) => t.matcher(msg)) || { icon: null, actions: {} };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col w-full sm:max-w-sm lg:max-w-md"
      >
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            See all your friend requests, promise requests, and messages over
            here!
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden px-4">
          <ScrollArea className="h-full w-full rounded-md border">
            <div className="p-4 space-y-2">
              {isLoading && <div className="text-sm">Loading...</div>}
              {results.length == 0 && <p>No Notifcations yet!</p>}
              {results.map((notif) => {
                const { icon: Icon, actions } = getTypeData(notif.message);
                return (
                  <div
                    key={notif.id}
                    className={`flex flex-col gap-2 p-3 rounded-md border cursor-pointer transition ${
                      !notif.read && "font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4 text-blue-500" />}
                      <span className="text-sm">@{notif.sender_username}</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {notif.message}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(notif.created_at).toLocaleString()} —{" "}
                      {notif.read ? "Read" : "Unread"}
                    </div>

                    {actions.accept && (
                      <div className="flex gap-3 mt-2">
                        <Button
                          onClick={() =>
                            actions.accept({
                              id: notif.id,
                              info: notif.sender_username,
                            })
                          }
                          className="flex-1 rounded-xl text-white font-medium 
                 hover:bg-purple-700 transition-all duration-200 
                 hover:shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() =>
                            actions.decline({
                              id: notif.id,
                              info: notif.sender_username,
                            })
                          }
                          className="flex-1 rounded-xl bg-gray-800 text-gray-300 font-medium 
                 hover:bg-gray-700 hover:text-white transition-all duration-200"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <SheetFooter className="flex justify-between">
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
