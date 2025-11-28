import { useState } from "react"
import { useSessionContext } from "@/contexts/session-provider"
import { NavLink } from "react-router"

import { ModeToggle } from "@/components/theme/mode-toggle"

import { getNavItems, userActions } from "./config"
import { DesktopNav } from "./DesktopNav"
import { MobileDrawer } from "./MobileDrawer"
import { UserCard } from "./UserCard"

export default function Header() {
  const title = import.meta.env.VITE_APP_TITLE
  const { userInfo, userInfoLoading } = useSessionContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isAdmin = userInfo?.role === 1
  const navItems = getNavItems(isAdmin)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16">
        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <DesktopNav navItems={navItems} />

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* User Info - Desktop only */}
          <div className="hidden items-center md:flex">
            <UserCard
              userInfo={userInfo}
              userInfoLoading={userInfoLoading}
              isAdmin={isAdmin}
              userActions={userActions}
            />
          </div>

          {/* Mobile menu button */}
          <MobileDrawer
            navItems={navItems}
            userActions={userActions}
            userInfo={userInfo}
            userInfoLoading={userInfoLoading}
            isAdmin={isAdmin}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
      </div>
    </header>
  )
}
