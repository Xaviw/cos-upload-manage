import { useState } from "react"
import {
  formatFileSize,
  renderFileThumbnail,
  type UploadRecord,
} from "@/utils/fileUtils"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { format } from "date-fns"
import {
  CheckCircle,
  Clock,
  MoreHorizontal,
  RotateCcw,
  Search,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// UploadRecord 接口已从 fileUtils 导入

// 版本号选项
const VERSION_OPTIONS = [
  { value: "v1.0.0.0", label: "v1.0.0.0" },
  { value: "v1.0.1.0", label: "v1.0.1.0" },
  { value: "v1.1.0.0", label: "v1.1.0.0" },
  { value: "v2.0.0.0", label: "v2.0.0.0" },
]

// 状态枚举和映射
const STATUS_MAP = {
  approved: {
    label: "已审核",
    icon: CheckCircle,
    variant: "default" as const,
  },
  pending: {
    label: "待审核",
    icon: Clock,
    variant: "secondary" as const,
  },
  rejected: {
    label: "已拒绝",
    icon: X,
    variant: "destructive" as const,
  },
}

// 列ID与中文名称映射
const COLUMN_LABELS: Record<string, string> = {
  version: "版本号",
  fileName: "文件",
  fileUrl: "缩略图",
  fileSize: "大小",
  status: "状态",
  uploadUser: "上传用户",
  uploadTime: "上传时间",
  auditUser: "审核用户",
  auditTime: "审核时间",
  actions: "操作",
}

// renderFileThumbnail 函数已从 fileUtils 导入

export default function UploadRecords() {
  // 数据加载逻辑
  // TODO: 调用API获取上传记录数据
  const [data, setData] = useState<UploadRecord[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // 临时解决 setData 未使用的问题
  console.log("setData 可用于更新表格数据:", setData)

  // 筛选器状态
  const [filterVersion, setFilterVersion] = useState<string>("")
  const [filterUser, setFilterUser] = useState<string>("")
  const [filterDateRange, setFilterDateRange] = useState<{
    from?: Date
    to?: Date
  }>({})

  // 重置筛选器
  const resetFilters = () => {
    setFilterVersion("")
    setFilterUser("")
    setFilterDateRange({})
    setColumnFilters([])
  }

  // 处理审核操作
  const handleAudit = (recordId: string, action: "approve" | "reject") => {
    // TODO: 调用API处理审核操作
    console.log("审核操作:", recordId, action)
  }

  // 处理搜索
  const handleSearch = () => {
    // TODO: 调用API根据筛选条件搜索数据
    console.log("搜索条件:", { filterVersion, filterUser, filterDateRange })
  }

  // 状态徽章渲染函数
  const renderStatusBadge = (status: keyof typeof STATUS_MAP) => {
    const statusInfo = STATUS_MAP[status]
    const StatusIcon = statusInfo.icon

    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <StatusIcon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    )
  }

  // 审核按钮渲染函数
  const renderAuditButton = (record: UploadRecord) => {
    const canAudit = record.status === "pending"

    return (
      <Button
        onClick={() => handleAudit(record.id, "approve")}
        disabled={!canAudit}
        variant="outline"
        size="sm"
      >
        审核
      </Button>
    )
  }

  // 日期渲染函数
  const formatDate = (date: Date | null | undefined) =>
    date ? format(date, "yyyy-MM-dd HH:mm:ss") : "-"

  // 表格列定义
  const columns: ColumnDef<UploadRecord>[] = [
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
      accessorKey: "actions",
      header: COLUMN_LABELS.actions,
      cell: ({ row }) => renderAuditButton(row.original),
    },
  ]

  // UI表格配置
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  // 表格行渲染组件
  const TableRows = () => {
    const { rows } = table.getRowModel()

    return rows?.length ? (
      rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          暂无数据
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>上传记录</CardTitle>
          <CardDescription>管理和审核所有上传的文件记录</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 筛选器部分 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {/* 版本号筛选 */}
            <div>
              <label className="mb-2 block text-sm font-medium">版本号</label>
              <Select value={filterVersion} onValueChange={setFilterVersion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="请选择版本号" />
                </SelectTrigger>
                <SelectContent>
                  {VERSION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 上传用户筛选 */}
            <div>
              <label className="mb-2 block text-sm font-medium">上传用户</label>
              <Input
                placeholder="请输入上传用户名"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              />
            </div>

            {/* 上传时间筛选 */}
            <div>
              <label className="mb-2 block text-sm font-medium">上传时间</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {filterDateRange.from && filterDateRange.to
                      ? `${format(filterDateRange.from, "yyyy-MM-dd")} - ${format(
                          filterDateRange.to,
                          "yyyy-MM-dd"
                        )}`
                      : filterDateRange.from
                        ? format(filterDateRange.from, "yyyy-MM-dd")
                        : "请选择"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: filterDateRange.from,
                      to: filterDateRange.to,
                    }}
                    onSelect={(range) =>
                      setFilterDateRange({
                        from: range?.from,
                        to: range?.to,
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-end space-x-2">
              <Button
                onClick={handleSearch}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                搜索
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                重置
              </Button>
            </div>
          </div>

          <Separator />

          {/* 表格部分 */}
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    列显示 <MoreHorizontal className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {COLUMN_LABELS[column.id] || column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  <TableRows />
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
