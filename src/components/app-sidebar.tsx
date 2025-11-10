import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconListDetails,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/app/auth/store"

const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Pengajuan",
      url: "/pengajuan",
      icon: IconListDetails,
    },
    {
      title: "Pengguna",
      url: "/pengguna",
      icon: IconChartBar,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="px-10">
          <img className="w-full h-auto" src="/logo-bsb.svg" alt="logo-bsb" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.firstName + " " + user?.lastName || '',
          email: user?.email || '',
          profileInitials: `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`,
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
