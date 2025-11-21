import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/TokenRefresh";
import { toast } from "sonner";
import { Heart, UserCheck } from "lucide-react";

export default function useNotificationActions() {
  const queryClient = useQueryClient();

  const acceptFriendRequest = useMutation({
    mutationFn: ({ id }) =>
      axiosInstance.post(
        "http://127.0.0.1:8000/users/respond_to_friendrequest",
        {
          notification_id: id,
          action: "accept",
        }
      ),
    onSuccess: (_, vars) => {
      toast(`You are now friends with ${vars.info}!`);
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unread-status"]);
      queryClient.invalidateQueries(["friends"]);
    },
  });

  const declineFriendRequest = useMutation({
    mutationFn: ({ id }) =>
      axiosInstance.post(
        "http://127.0.0.1:8000/users/respond_to_friendrequest",
        {
          notification_id: id,
          action: "reject",
        }
      ),
    onSuccess: (_, vars) => {
      toast(`You rejected ${vars.info}'s request.`);
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["unread-status"]);
    },
  });

  // Match by content
  const types = [
    {
      matcher: (msg) => msg.toLowerCase().includes("friend request"),
      icon: Heart,
      actions: {
        accept: acceptFriendRequest,
        decline: declineFriendRequest,
      },
    },
    {
      matcher: (msg) => msg.toLowerCase().includes("promise request"),
      icon: UserCheck,
      actions: {
        accept: (id) => console.log("accept promise", id),
        decline: (id) => console.log("decline promise", id),
      },
    },
  ];

  return types;
}
