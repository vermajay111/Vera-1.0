import * as React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Command,
  LogIn,
  UserPlus,
  Accessibility,
  Globe,
  Send,
  CircleHelp,
  Database,
  ShieldAlert,
  Users,
  BellRing,
  Newspaper,
  UserRoundPlusIcon,
  MoveRight,
} from "lucide-react";

import { SearchForFriends } from "../searchFriends/friends";
import { MyFriends } from "../myFriends/myFriends";
import { Notifcations } from "../notifications/notifications";
import { NavUser } from "./nav-user";
import { PromiseSlide } from "../promiseSlide/promiseSlide";

// -------- JSON NAVIGATION --------
const auth_buttons = {
  navMain: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Start New Promise",
          url: "/start_new_promise",
          icon: Newspaper,
        },
        {
          title: "Browse Friends",
          Wrapper: SearchForFriends,
          icon: UserRoundPlusIcon,
        },
      ],
    },
    {
      title: "Management",
      items: [
        { title: "My Promises", Wrapper: PromiseSlide, icon: ShieldAlert },
        { title: "My Friends", Wrapper: MyFriends, icon: Users },
        { title: "Notifications", Wrapper: Notifcations, icon: BellRing },
      ],
    },
    {
      title: "Help",
      items: [
        { title: "Support", url: "#", icon: Globe },
        { title: "Feedback", url: "#", icon: Send },
        { title: "FAQ", url: "#", icon: CircleHelp },
      ],
    },
  ],
  navFooter: [
    {
      title: "Account Management",
      items: [{ title: "Settings", url: "/settings", icon: Database }],
    },
  ],
};

const guest = {
  navMain: [
    {
      title: "Getting Started",
      items: [
        {title: "Start", url:"/", icon: MoveRight},
        { title: "Login", url: "/login", icon: LogIn },
        { title: "Signup", url: "/signup", icon: UserPlus },
      ],
    },
    {
      title: "Help",
      items: [
        { title: "Support", url: "#", icon: Globe },
        { title: "Feedback", url: "#", icon: Send },
        { title: "FAQ", url: "#", icon: CircleHelp },
      ],
    },
  ],
};

// -------- MAIN SIDEBAR COMPONENT --------
export function AppSidebar(props) {
  const username = useSelector((state) => state.user.value);
  const token = useSelector((state) => state.token.refresh);

  const user_info = {
    name: username,
    email: username ? `Welcome back, ${username}` : "",
    avatar: "/avatars/shadcn.jpg",
  };

  const data = username && token ? auth_buttons : guest;

  return (
    <Sidebar {...props} className="bg-black/90 border-r border-gray-800">
      {/* -------- Header -------- */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                to="/home"
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="w-5 h-5 text-purple-300/70" />
                </div>
                <div className="grid flex-1 text-left text-base leading-tight">
                  <span className="truncate font-medium text-white">Vera</span>
                  <span className="truncate text-sm text-gray-400">
                    Keep Your Word
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* -------- Main Navigation -------- */}
      <SidebarContent>
        {data.navMain.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-gray-300 text-base">
              {section.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.Wrapper ? (
                      <item.Wrapper>
                        <SidebarMenuButton asChild>
                          <div className="flex items-center gap-2 text-base cursor-pointer text-gray-300 hover:text-purple-300 transition-colors">
                            <item.icon className="w-4 h-4 text-gray-400 group-hover:text-purple-300 transition-colors" />
                            <span>{item.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </item.Wrapper>
                    ) : (
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.url}
                          className="flex items-center gap-2 text-base cursor-pointer text-gray-300 hover:text-purple-300 transition-colors"
                        >
                          <item.icon className="w-4 h-4 text-gray-400 group-hover:text-purple-300 transition-colors" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* -------- Footer -------- */}
      {username && token && (
        <SidebarFooter>
          <NavUser user={user_info} />
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
}
