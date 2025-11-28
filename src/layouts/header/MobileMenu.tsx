import { NavLink } from "react-router"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import type { NavItem, UserAction } from "./config"

interface MobileMenuProps {
  navItems: NavItem[]
  userActions: UserAction[]
  setIsMobileMenuOpen: (open: boolean) => void
}

export function MobileMenu({
  navItems,
  userActions,
  setIsMobileMenuOpen,
}: MobileMenuProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        )
      })}
      <div className="mt-4 border-t pt-4">
        {userActions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.id}
              variant={action.variant || "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => {
                action.onClick?.()
                setIsMobileMenuOpen(false)
              }}
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
