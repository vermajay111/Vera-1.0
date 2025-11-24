import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { motion } from "framer-motion";
import * as React from "react";
import { UserPlus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useFriendsSearch } from "@/hooks/useFriendsSearch";

export function MyFriends({ children }) {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");

  const { results: friends = [], isLoading } = useFriendsSearch(query);

  const handleViewProfile = (user_id) => {
    navigate(`/user_profile_page/${user_id}`);
  };

  const handleAddFriend = (id) => {
    console.log("Add friend:", id);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="left"
        className="flex flex-col w-full sm:max-w-sm lg:max-w-md bg-black text-white border-r border-gray-800"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-white">
            My Friends
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            See the full list of all your friends.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-3 px-4 mt-4">
          <Label htmlFor="friend-search" className="text-gray-300">
            Username
          </Label>
          <Input
            id="friend-search"
            placeholder="Type a username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-gray-900 text-white border-gray-700 focus-visible:ring-purple-500"
          />
        </div>

        <div className="flex-1 overflow-hidden px-4 mt-4">
          <ScrollArea className="h-full w-full rounded-md border border-gray-800">
            <div className="p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                All Friends
              </h4>

              {isLoading && (
                <div className="text-sm text-gray-500 text-center py-6">
                  Loading...
                </div>
              )}

              {!isLoading && friends.length === 0 && query.length > 0 && (
                <div className="text-sm text-gray-500 text-center py-6">
                  No results found.
                </div>
              )}

              {friends.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.default_avatar ||
                        user.profile_pic ||
                        "/default-avatar.png"
                      }
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover border border-gray-700"
                    />

                    <div>
                      <div className="text-sm font-medium text-white">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        @{user.username}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                      onClick={() => handleViewProfile(user.username)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                      onClick={() => handleAddFriend(user.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator className="my-4 bg-gray-800" />

        <SheetFooter>
          <SheetClose asChild>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-purple-900/30 hover:text-white"
            >
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
