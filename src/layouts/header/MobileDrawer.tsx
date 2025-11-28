import type { User } from "@/types"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import type { NavItem, UserAction } from "./config"
import { MobileMenu } from "./MobileMenu"

interface MobileDrawerProps {
  navItems: NavItem[]
  userActions: UserAction[]
  userInfo: User | null
  userInfoLoading: boolean
  isAdmin: boolean
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export function MobileDrawer({
  navItems,
  userActions,
  userInfo,
  userInfoLoading,
  isAdmin,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: MobileDrawerProps) {
  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <div className="flex items-center gap-2 pb-4">
            <h2 className="text-lg font-semibold">菜单</h2>
          </div>
        </SheetHeader>
        <MobileMenu
          navItems={navItems}
          userActions={userActions}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div className="mt-auto border-t pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div>
              {userInfoLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                  <div className="mt-1">
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium">{userInfo?.name || ""}</p>
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground">管理员</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {userInfo?.email || ""}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
