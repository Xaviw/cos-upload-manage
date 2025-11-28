import { FileText, Home, Key, LogOut, Users } from "lucide-react"

export interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export interface UserAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  variant?: "ghost" | "destructive"
  onClick?: () => void
}

export const getNavItems = (isAdmin: boolean): NavItem[] => [
  { to: "/", label: "首页", icon: Home },
  { to: "/records", label: "上传记录", icon: FileText },
  ...(isAdmin ? [{ to: "/users", label: "用户管理", icon: Users }] : []),
]

export const userActions: UserAction[] = [
  {
    id: "change-password",
    label: "修改密码",
    icon: Key,
    variant: "ghost",
  },
  {
    id: "logout",
    label: "退出登录",
    icon: LogOut,
    variant: "ghost",
  },
]
