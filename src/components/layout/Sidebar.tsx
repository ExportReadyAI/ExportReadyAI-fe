"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth.store"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Package,
  Users,
  LogOut,
  Sparkles,
  Rocket,
  FileText,
  ShoppingCart,
  Truck,
  UserCircle,
  BookOpen,
  TrendingUp,
  BookMarked,
  MessageSquare,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Admin", "UMKM"],
    color: "#0284C7",
  },
  {
    title: "Business Profile",
    href: "/business-profile",
    icon: Building2,
    roles: ["Admin", "UMKM"],
    color: "#22C55E",
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
    roles: ["Admin", "UMKM"],
    color: "#F59E0B",
  },
  {
    title: "Katalog",
    href: "/catalogs",
    icon: BookMarked,
    roles: ["Admin", "UMKM"],
    color: "#8B5CF6",
  },
  {
    title: "Export Analysis",
    href: "/export-analysis",
    icon: FileText,
    roles: ["Admin", "UMKM"],
    color: "#0284C7",
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: TrendingUp,
    roles: ["Admin", "UMKM"],
    color: "#EC4899",
  },
  {
    title: "Asisten AI",
    href: "/chat",
    icon: MessageSquare,
    roles: ["UMKM"],
    color: "#F59E0B",
  },
  {
    title: "Buyer Requests",
    href: "/buyer-requests",
    icon: ShoppingCart,
    roles: ["Admin", "Buyer"],
    color: "#EC4899",
  },
  {
    title: "Buyers",
    href: "/buyers",
    icon: ShoppingCart,
    roles: ["Admin", "UMKM"],
    color: "#EC4899",
  },
  {
    title: "Forwarders",
    href: "/forwarders",
    icon: Truck,
    roles: ["Admin", "UMKM"],
    color: "#6366F1",
  },
  {
    title: "My Profile",
    href: "/forwarders/my-profile",
    icon: Truck,
    roles: ["Forwarder"],
    color: "#6366F1",
  },
  {
    title: "Catalogs",
    href: "/forwarders/catalogs",
    icon: BookMarked,
    roles: ["Forwarder"],
    color: "#8B5CF6",
  },
  {
    title: "My Profile",
    href: "/buyers/my-profile",
    icon: UserCircle,
    roles: ["Buyer"],
    color: "#EC4899",
  },
  {
    title: "Educational Materials",
    href: "/educational",
    icon: BookOpen,
    roles: ["Admin", "UMKM"],
    color: "#0284C7",
  },
  {
    title: "Manage Educational",
    href: "/educational/admin",
    icon: BookOpen,
    roles: ["Admin"],
    color: "#0284C7",
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: ["Admin"],
    color: "#8B5CF6",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout, isAdmin, isUMKM, isBuyer, isForwarder } = useAuthStore()

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.roles.includes("Admin") && isAdmin()) return true
    if (item.roles.includes("UMKM") && isUMKM()) return true
    if (item.roles.includes("Buyer") && isBuyer()) return true
    if (item.roles.includes("Forwarder") && isForwarder()) return true
    return false
  })

  return (
    <div className="flex h-screen w-72 flex-col bg-white border-r-2 border-[#e0f2fe]">
      {/* Logo Header */}
      <div className="flex h-20 items-center px-6 border-b-2 border-[#e0f2fe]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0284C7] shadow-[0_4px_0_0_#065985]">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#0C4A6E]">ExportReady</h1>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#F59E0B]" />
              <span className="text-xs font-bold text-[#F59E0B]">AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-bold text-[#7DD3FC] uppercase tracking-wider">
          Menu
        </p>
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all duration-200",
                isActive
                  ? "bg-[#0284C7] text-white shadow-[0_4px_0_0_#065985] -translate-y-0.5"
                  : "text-[#0C4A6E] hover:bg-[#F0F9FF] hover:shadow-[0_4px_0_0_#e0f2fe] hover:-translate-y-0.5"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                  isActive
                    ? "bg-white/20"
                    : "bg-[#F0F9FF] group-hover:bg-white"
                )}
                style={{ 
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : undefined,
                }}
              >
                <Icon 
                  className={cn(
                    "h-5 w-5 transition-all",
                    isActive ? "text-white" : ""
                  )}
                  style={{ color: isActive ? 'white' : item.color }}
                />
              </div>
              <span className="text-base">{item.title}</span>
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t-2 border-[#e0f2fe] p-4">
        {/* User Card */}
        <div className="mb-3 rounded-2xl bg-gradient-to-r from-[#F0F9FF] to-[#e0f2fe] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7DD3FC] text-[#0C4A6E] font-extrabold text-lg shadow-[0_3px_0_0_#38bdf8]">
              {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#0C4A6E] truncate">
                {user?.full_name || "User"}
              </p>
              <p className="text-xs font-medium text-[#0284C7] truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#0284C7] px-2 py-0.5 text-xs font-bold text-white">
              {user?.role || "UMKM"}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout()
            window.location.href = "/login"
          }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-[#fecaca] bg-white px-4 py-3 font-bold text-[#EF4444] transition-all hover:bg-[#fef2f2] hover:shadow-[0_4px_0_0_#fecaca] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
