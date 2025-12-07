import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Users,
  BarChart3,
  Settings,
  FileText,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Map View", href: "/dashboard/map" },
  { icon: Users, label: "Population", href: "/dashboard/population" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: FileText, label: "Reports", href: "/dashboard/reports" },
  { icon: History, label: "History", href: "/dashboard/history" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

function DashboardSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        {/* 🔁 CIVORA logo now matches Landing Header */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-sidebar-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none" />
            <circle cx="8" cy="8" r="2" stroke="currentColor" fill="none" opacity="0.7" />
            <circle cx="16" cy="8" r="2" stroke="currentColor" fill="none" opacity="0.7" />
            <circle cx="8" cy="16" r="2" stroke="currentColor" fill="none" opacity="0.7" />
            <circle cx="16" cy="16" r="2" stroke="currentColor" fill="none" opacity="0.7" />
            <path
              d="M10 10 L12 12 M14 10 L12 12 M10 14 L12 12 M14 14 L12 12"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
        </div>
        <span className="text-sm font-medium tracking-widest text-sidebar-foreground">
          CIVORA
        </span>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Link
          to="/"
          className="text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground"
        >
          Back to Home
        </Link>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
