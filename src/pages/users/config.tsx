import { type Bucket, type User, type UserInsert } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Package, UserCheck, UserX } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { UserStatus } from "./config"

// 重新导出类型以供其他文件使用
export type { User, Bucket }
export type { UserStatus, UserRole } from "@/types/supabase"

// 状态枚举和映射
export const STATUS_MAP = {
  enabled: {
    label: "启用",
    icon: UserCheck,
    variant: "default" as const,
  },
  disabled: {
    label: "禁用",
    icon: UserX,
    variant: "destructive" as const,
  },
}

// 列ID与中文名称映射
export const COLUMN_LABELS: Record<string, string> = {
  name: "用户名",
  email: "用户邮箱",
  created_at: "注册时间",
  updated_at: "修改时间",
  status: "用户状态",
  role: "用户角色",
  bucket_ids: "可用存储桶",
  actions: "操作",
}

// 搜索表单值类型
export type SearchFormValues = Partial<UserInsert>

// 状态选项
export const STATUS_OPTIONS = Object.entries(STATUS_MAP).map(
  ([key, value]) => ({
    value: key,
    label: value.label,
    icon: value.icon,
    variant: value.variant,
  })
)

// 用户角色映射
export const ROLE_MAP = {
  normal: "普通用户",
  admin: "管理员",
}

// 用户角色选项
export const ROLE_OPTIONS = Object.entries(ROLE_MAP).map(([key, value]) => ({
  value: key,
  label: value,
}))

// 表格列定义
export const columns = (
  onStatusToggle: (userId: string, status: UserStatus) => void,
  buckets: Bucket[] = []
): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: COLUMN_LABELS.name,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: COLUMN_LABELS.email,
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: COLUMN_LABELS.role,
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      const roleLabel = ROLE_MAP[role as keyof typeof ROLE_MAP]
      return <div>{roleLabel || "-"}</div>
    },
  },
  {
    accessorKey: "status",
    header: COLUMN_LABELS.status,
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof STATUS_MAP
      const statusInfo = STATUS_MAP[status]
      const StatusIcon = statusInfo.icon

      return (
        <Badge variant={statusInfo.variant} className="flex items-center gap-1">
          <StatusIcon className="h-3 w-3" />
          {statusInfo.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "bucket_ids",
    header: COLUMN_LABELS.bucket_ids,
    cell: ({ row }) => {
      const bucketIds = row.getValue("bucket_ids") as string[] | null
      if (!bucketIds || bucketIds.length === 0) {
        return <div className="text-muted-foreground">-</div>
      }

      return (
        <div className="space-y-1">
          {bucketIds.map((id) => {
            const bucket = buckets.find((b) => b.id === id)
            return (
              <div key={id} className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                <span className="text-xs">{bucket?.bucket || id}</span>
              </div>
            )
          })}
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: COLUMN_LABELS.created_at,
    cell: ({ row }) => (
      <div>
        {row.getValue("created_at")
          ? format(new Date(row.getValue("created_at")), "yyyy-MM-dd HH:mm:ss")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: COLUMN_LABELS.updated_at,
    cell: ({ row }) => (
      <div>
        {row.getValue("updated_at")
          ? format(new Date(row.getValue("updated_at")), "yyyy-MM-dd HH:mm:ss")
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: COLUMN_LABELS.actions,
    cell: ({ row }) => {
      const user = row.original
      const isEnabled = user.status === "enabled"

      return (
        <Button
          onClick={() =>
            onStatusToggle(user.id, isEnabled ? "disabled" : "enabled")
          }
          variant={isEnabled ? "outline" : "default"}
          size="sm"
        >
          {isEnabled ? "禁用" : "启用"}
        </Button>
      )
    },
  },
]
