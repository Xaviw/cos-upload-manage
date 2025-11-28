import type { User } from "@/types"
import { Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import type { UserAction } from "./config"

interface UserCardProps {
  userInfo: User | null
  userInfoLoading: boolean
  isAdmin: boolean
  userActions: UserAction[]
}

export function UserCard({
  userInfo,
  userInfoLoading,
  isAdmin,
  userActions,
}: UserCardProps) {
  if (userInfoLoading) {
    return <Loader2 className="mx-3 h-4 w-4 animate-spin" />
  }

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-accent/80">
          <div className="hidden sm:block">
            <span className="text-sm font-medium group-hover:text-primary">
              {userInfo?.name || ""}
            </span>
          </div>
          {isAdmin && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-xs text-primary transition-colors hover:bg-primary/20"
            >
              管理员
            </Badge>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-48 border p-2 shadow-lg" align="end">
        <div className="space-y-1">
          <div className="border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm font-medium">{userInfo?.name || ""}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {userInfo?.email || ""}
            </p>
          </div>
          <div className="py-1">
            {userActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.id}
                  variant={action.variant || "ghost"}
                  className={`h-auto w-full justify-start gap-2 px-3 py-2 hover:bg-accent/50 ${
                    action.id === "logout"
                      ? "text-destructive hover:bg-destructive/5 hover:text-destructive"
                      : ""
                  }`}
                  onClick={action.onClick}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
