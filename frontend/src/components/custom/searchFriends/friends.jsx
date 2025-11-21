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
import { axiosInstance } from "@/utils/TokenRefresh";
import { motion } from "framer-motion";
import * as React from "react";
import { UserPlus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
export function SearchForFriends({ children }) {
  const navigate = useNavigate();
  const friendsEndpoint = "http://127.0.0.1:8000/users/search_for_friends";
  const [query, setQuery] = React.useState("");
  const [timer, setTimer] = React.useState(null);
  const [results, setResults] = React.useState([]);

  const searchFriends = async (q) => {
    if (!q) {
      setResults([]);
      return;
    }
    try {
      const response = await axiosInstance.get(friendsEndpoint, {
        params: { username: q },
      });
      setResults(response.data.results);
    } catch (err) {
      console.error("Error searching friends:", err);
    }
  };

  React.useEffect(() => {
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      searchFriends(query);
    }, 250);
    setTimer(newTimer);
    return () => clearTimeout(newTimer);
  }, [query]);

  const handleAddFriend = (id) => {
    // TODO: Implement API call for sending friend request
    console.log("Send friend request to:", id);
  };

  const handleViewProfile = (id) => {
    navigate(`/user_profile_page/${id}`);
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
            Surf New People
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Search by username and connect with new friends.
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
                Search Results
              </h4>

              {results.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-6">
                  No results found.
                </div>
              )}

              {results.map((user, index) => (
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
                        user.deafult_avatar ||
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
                      onClick={() => handleViewProfile(user.id)}
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
