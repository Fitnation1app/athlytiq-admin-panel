"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "./sidebar-provider"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Wallet, BarChart3, Settings, HelpCircle, LogOut, Menu, FileText,Dumbbell, Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp} from "lucide-react"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users, badge: "8" },
  { name: "Community", href: "/comms", icon: () => <FontAwesomeIcon icon={faPeopleGroup} className="h-5 w-5" /> },  
  { name: "Reports", href: "/reports", icon: FileText },
  { name:"Manage Workout",href:"/manage-workout",icon:Dumbbell}
  
]

const footerItems = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings, 
    subItems: [
      { name: "Profile", href: "/settings/profile", description: "Update your details" },
      { name: "Security", href: "/settings/security", description: "Manage your password" },
  
    ],
  },
  
  { name: "Logout", href: "/login", icon: LogOut, description: "Exit the app" },
]

export function Sidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebar()
  const handleLogout = () => {
    // localStorage.removeItem('adminToken');
    router.push('/login');
  };
return (
  <>
    <div
      className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden", isOpen ? "block" : "hidden")}
      onClick={toggle}
    />
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-background",
        "transition-transform duration-300 ease-in-out",
        "border-r",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-lg font-semibold">Admin Dashboard</span>
        <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={toggle}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-y-5 px-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                {typeof item.icon === "function" ? item.icon() : <item.icon className="h-5 w-5" />}
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[0.625rem] font-medium text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-2">
          <nav className="grid gap-1">
            {footerItems.map((item, index) => (
              <div key={index}>
                {item.name === "Settings" ? (
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setSettingsOpen((open) => !open)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground w-full",
                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {settingsOpen ? (
                        <ChevronUp className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      )}
                    </button>
                    {settingsOpen && (
                      <div className="pl-4 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                              pathname === subItem.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                          >
                            <span>{subItem.name}</span>
                            {subItem.description && (
                              <span className="ml-auto text-xs text-muted-foreground">{subItem.description}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={item.name === "Logout" ? handleLogout : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.description && (
                      <span className="ml-auto text-xs text-muted-foreground">{item.description}</span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  </>
)


}
