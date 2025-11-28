import { NavLink } from "react-router"

import { cn } from "@/lib/utils"

import type { NavItem } from "./config"

interface DesktopNavProps {
  navItems: NavItem[]
}

export function DesktopNav({ navItems }: DesktopNavProps) {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "relative rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          {({ isActive }) => (
            <div className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.label}
              {isActive && (
                <div className="absolute inset-0 -z-10 rounded-md bg-primary/10" />
              )}
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
