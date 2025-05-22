"use client"

import { useSidebar } from "./sidebar-provider"
import { Bell, Search, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {NotificationPopover} from "@/components/notification-popover"

export function Header() {
  const { toggle } = useSidebar()
  const router = useRouter()
  const handleLogout = () => {
    // localStorage.removeItem('adminToken');
    router.push('/login');
  };
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* <NotificationPopover />  <-- Removed left notification bell */}

        <div className="flex-1">
          <form>
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
        </div>

        {/* Replace the right bell button with NotificationPopover */}
        <NotificationPopover />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <User className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

const notifications = [
  {
    id: 1,
    user: "Jenny Wilson",
    message: "Hey cute! How are you? 😊",
    time: "12:47 AM",
    avatar: "/avatars/jenny.jpg",
    unread: true,
    badge: 11,
  },
  {
    id: 2,
    user: "Jane Cooper",
    message: "I love how your tutorial simplifies the process...",
    time: "12:47 AM",
    avatar: "/avatars/jane.jpg",
    unread: false,
  },
  // ...more notifications
];

export function NotificationPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-green-500 rounded-full">
            {notifications.filter(n => n.unread).length}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 border-b font-semibold">Notifications</div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 ${n.unread ? "bg-blue-50" : ""}`}>
              <img src={n.avatar} alt={n.user} className="w-10 h-10 rounded-full object-cover border-2 border-blue-400" />
              <div className="flex-1">
                <div className="font-medium">{n.user} {n.badge && <span className="ml-1 text-xs bg-blue-500 text-white rounded-full px-1">{n.badge}</span>}</div>
                <div className="text-xs text-gray-600 truncate">{n.message}</div>
              </div>
              <div className="text-xs text-gray-400">{n.time}</div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}