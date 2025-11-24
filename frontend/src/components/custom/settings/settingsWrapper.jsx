import * as React from "react";
import { SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SettingsWrapper({ user }) {
  const [bio, setBio] = React.useState(user?.bio || "");
  const [username, setUsername] = React.useState(user?.username || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [firstName, setFirstName] = React.useState(user?.first_name || "");
  const [lastName, setLastName] = React.useState(user?.last_name || "");
  const [avatar, setAvatar] = React.useState(null);
  const [preview, setPreview] = React.useState(user?.avatar || null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    // TODO: call your API to update profile
    console.log({ bio, username, email, firstName, lastName, avatar });
  };



  return (
    <Drawer>
      <DropdownMenuGroup>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <DrawerTrigger asChild>
            <button className="flex w-full items-center gap-2 px-2 py-1 rounded-md">
              <SettingsIcon className="w-4 h-4 text-purple-300" />
              Account Settings
            </button>
          </DrawerTrigger>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DrawerContent className="p-6 sm:p-8 max-w-md bg-black/50 backdrop-blur-md border border-gray-800 rounded-2xl overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle className="text-white text-2xl font-bold">
            Your Account Settings
          </DrawerTitle>
          <DrawerDescription className="text-gray-400">
            Update your information and profile picture here. Click save when
            finished.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-2">
            {preview && (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full border-2 border-purple-400 object-cover shadow-lg"
              />
            )}
            <Input type="file" onChange={handleAvatarChange} />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label className="text-purple-300 font-medium">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Type your bio here..."
              className="bg-black/30 text-white placeholder-purple-300/50 border border-gray-700 focus-visible:ring-purple-500"
            />
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="bg-black/30 text-white placeholder-purple-300/50 border border-gray-700 focus-visible:ring-purple-500"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-black/30 text-white placeholder-purple-300/50 border border-gray-700 focus-visible:ring-purple-500"
            />
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="bg-black/30 text-white placeholder-purple-300/50 border border-gray-700 focus-visible:ring-purple-500"
            />
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="bg-black/30 text-white placeholder-purple-300/50 border border-gray-700 focus-visible:ring-purple-500"
            />
          </div>
        </div>

        <DrawerFooter className="mt-6 flex justify-end gap-2">
          <Button
            onClick={handleSubmit}
            className="bg-purple-700 hover:bg-purple-600 text-white"
          >
            Save
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="text-gray-300 border-gray-600">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
