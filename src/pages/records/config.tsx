import {
  formatFileSize,
  renderFileThumbnail,
  type UploadRecord,
} from "@/utils/fileUtils"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { CheckCircle, Clock, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// 版本号选项
export const VERSION_OPTIONS = [
  { value: "v1.0.0.0", label: "v1.0.0.0" },
  { value: "v1.0.1.0", label: "v1.0.1.0" },
  { value: "v1.1.0.0", label: "v1.1.0.0" },
  { value: "v2.0.0.0", label: "v2.0.0.0" },
]

// 状态枚举和映射
export const STATUS_MAP = {
  approved: {
    label: "已审核",
    icon: "CheckCircle",
    variant: "default" as const,
  },
  pending: {
    label: "待审核",
    icon: "Clock",
    variant: "secondary" as const,
  },
  rejected: {
    label: "已拒绝",
    icon: "X",
    variant: "destructive" as const,
  },
}

// 列ID与中文名称映射
export const COLUMN_LABELS: Record<string, string> = {
  version: "版本号",
  fileName: "文件",
  fileUrl: "缩略图",
  fileSize: "大小",
  status: "状态",
  uploadUser: "上传用户",
  uploadTime: "上传时间",
  auditUser: "审核用户",
  auditTime: "审核时间",
  auditRemark: "审核备注",
  actions: "操作",
}

// 表单筛选字段类型
export type FilterFormState = {
  version: string
  user: string
  dateRange: {
    from?: Date
    to?: Date
  }
}

// 状态选项
export const STATUS_OPTIONS = Object.entries(STATUS_MAP).map(
  ([key, value]) => ({
    value: key,
    label: value.label,
    icon: value.icon,
    variant: value.variant,
  })
)

// 搜索表单值类型
export type SearchFormValues = {
  version: string
  user: string
  statuses: string[] // 多选状态
  dateRange: {
    from?: Date
    to?: Date
  }
}

// 状态徽章渲染函数
export const renderStatusBadge = (status: keyof typeof STATUS_MAP) => {
  const statusInfo = STATUS_MAP[status]
  const StatusIcon =
    statusInfo.icon === "CheckCircle"
      ? CheckCircle
      : statusInfo.icon === "Clock"
        ? Clock
        : X

  return (
    <Badge variant={statusInfo.variant} className="flex items-center gap-1">
      <StatusIcon className="h-3 w-3" />
      {statusInfo.label}
    </Badge>
  )
}

// 审核按钮渲染函数
export const renderAuditButton = (
  record: UploadRecord,
  onAudit: (recordId: string, action: "approve" | "reject") => void
) => {
  const canAudit = record.status === "pending"

  return (
    <Button
      onClick={() => onAudit(record.id, "approve")}
      disabled={!canAudit}
      variant="outline"
      size="sm"
    >
      审核
    </Button>
  )
}

// 日期渲染函数
export const formatDate = (date: Date | null | undefined) =>
  date ? format(date, "yyyy-MM-dd HH:mm:ss") : "-"

// 表格列定义
export const columns = (
  onAudit: (recordId: string, action: "approve" | "reject") => void
): ColumnDef<UploadRecord>[] => [
  {
    accessorKey: "version",
    header: COLUMN_LABELS.version,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("version")}</div>
    ),
  },
  {
    accessorKey: "fileName",
    header: COLUMN_LABELS.fileName,
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.original.fileName}</div>
    ),
  },
  {
    accessorKey: "fileUrl",
    header: COLUMN_LABELS.fileUrl,
    cell: ({ row }) => {
      const record = row.original
      return renderFileThumbnail(record, () => {
        if (record.fileType.startsWith("image/") && record.fileUrl) {
          window.open(record.fileUrl, "_blank")
        }
      })
    },
    enableSorting: false,
  },
  {
    accessorKey: "fileSize",
    header: COLUMN_LABELS.fileSize,
    cell: ({ row }) => <div>{formatFileSize(row.getValue("fileSize"))}</div>,
  },
  {
    accessorKey: "status",
    header: COLUMN_LABELS.status,
    cell: ({ row }) => renderStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "uploadUser",
    header: COLUMN_LABELS.uploadUser,
    cell: ({ row }) => <div>{row.getValue("uploadUser")}</div>,
  },
  {
    accessorKey: "uploadTime",
    header: COLUMN_LABELS.uploadTime,
    cell: ({ row }) => formatDate(row.getValue("uploadTime")),
  },
  {
    accessorKey: "auditUser",
    header: COLUMN_LABELS.auditUser,
    cell: ({ row }) => <div>{row.getValue("auditUser") || "-"}</div>,
  },
  {
    accessorKey: "auditTime",
    header: COLUMN_LABELS.auditTime,
    cell: ({ row }) => formatDate(row.getValue("auditTime")),
  },
  {
    accessorKey: "auditRemark",
    header: COLUMN_LABELS.auditRemark,
    cell: ({ row }) => formatDate(row.getValue("auditRemark")),
  },
  {
    accessorKey: "actions",
    header: COLUMN_LABELS.actions,
    cell: ({ row }) => renderAuditButton(row.original, onAudit),
  },
]
