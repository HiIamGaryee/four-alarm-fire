import { NotebookText, ChartColumnIncreasing } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Statement",
    url: "/",
    icon: NotebookText,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartColumnIncreasing,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-black text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300 text-2xl font-semibold ml-4 mb-4 mt-4">
            intelly
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
