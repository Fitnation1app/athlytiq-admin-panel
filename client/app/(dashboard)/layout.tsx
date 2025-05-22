import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SidebarProvider } from "@/components/sidebar-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
<div className="min-h-screen bg-white flex">
  <Sidebar />
  <div className="flex-1 lg:pl-72 bg-gradient-to-br from-indigo-100 via-white to-blue-100">
    <Header />
    <main className="p-4 md:p-6 lg:p-8">{children}</main>
  </div>
</div>
    </SidebarProvider>
  )
}
