import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  LogInIcon,
  InfoIcon,
  PaperclipIcon,
  User2Icon,
  UtensilsCrossedIcon,
  CookingPotIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSelector } from "react-redux";
import { LogOutIcon } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { PlusSquare } from "lucide-react";

const buttons = {
  home: { icon: <HomeIcon />, link: "/home" },
  login: { icon: <LogInIcon />, link: "/login" },
  signup: { icon: <User2Icon />, link: "/signup" },
  info: { icon: <InfoIcon />, link: "/info" },
  terms: { icon: <PaperclipIcon />, link: "/terms" },
};

const auth_buttons = {
  home: { icon: <HomeIcon />, link: "/home" },
  FindFood: { icon: <CookingPotIcon />, link: "/finder" },
  Dishes: { icon: <UtensilsCrossedIcon />, link: "/dishes" },
  Dashboard: { icon: <LayoutDashboard />, link: "/dashboard" },
  Create: { icon: <PlusSquare />, link: "/create" },
  Logout: { icon: <LogOutIcon />, link: "/logout" },
};

export default function Sidebar({ children }) {
  const username = useSelector((state) => state.user.value);
  const [sidebarSize, setSidebarSize] = useState(4);
  const navigate = useNavigate();

  const mergedButtons = username ? auth_buttons : buttons;
  const handleResizablePanelSize = (size) => {
    setSidebarSize(size);
  };

  const renderButton = (key, value) => {
    return sidebarSize <= 4 ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label={key}
            onClick={() => navigate(value.link)}
          >
            {value.icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
        </TooltipContent>
      </Tooltip>
    ) : (
      <Button variant="link" onClick={() => navigate(value.link)}>
        <span className="mr-2">
          {React.cloneElement(value.icon, {
            width: sidebarSize * 2.5 + 13,
          })}
        </span>
        <p style={{ fontSize: `${sidebarSize * 1.3 + 5}px` }}>
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </p>
      </Button>
    );
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen">
        <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
          <ResizablePanel
            defaultSize={13}
            minSize={3.8}
            maxSize={11}
            onResize={handleResizablePanelSize}
          >
            {sidebarSize >= 5 && (
              <div className="flex flex-col p-4">
                <h1
                  className="font-bold"
                  style={{
                    fontSize: `${sidebarSize * 2.7 + 10}px`,
                    fontFamily: "'Pacifico', cursive",
                  }}
                >
                  CheckUp
                </h1>
                <Separator className="my-4" />
              </div>
            )}
            <div className="flex flex-col p-4">
              <ul className="flex flex-col gap-4">
                {Object.entries(mergedButtons).map(([key, value]) => (
                  <li key={key} className="mb-4">
                    {renderButton(key, value)}
                  </li>
                ))}
                {username && (
                  <li className="mb-4">
                    {sidebarSize <= 4 ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate("/settings")}
                          >
                            <SettingsIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Settings</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button variant="link">
                            <span className="mr-2">
                              <SettingsIcon width={sidebarSize * 2.5 + 15} />
                            </span>
                            <p
                              style={{
                                fontSize: `${sidebarSize * 2 + 5}px`,
                              }}
                            >
                              Settings
                            </p>
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Your Account Settings</DrawerTitle>
                            <DrawerDescription>
                              These are critical account settings! Be careful!
                            </DrawerDescription>
                          </DrawerHeader>
                          <DrawerFooter>
                            <Button variant="secondary">Change Username</Button>
                            <Button variant="secondary">Change Password</Button>
                            <Button variant="secondary">
                              Other account settings
                            </Button>
                            <DrawerClose>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    )}
                  </li>
                )}
              </ul>
              {username && <Separator className="my-4" />}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={90}>
            <ScrollArea className="flex h-full w-full items-center justify-center flex-col">
              {children}
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
}
