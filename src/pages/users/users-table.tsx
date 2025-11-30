import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type OnChangeFn,
  type VisibilityState,
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  COLUMN_LABELS,
  columns,
  type Bucket,
  type User,
  type UserStatus,
} from "./config"

interface UsersTableProps {
  data: User[]
  columnVisibility: VisibilityState
  onColumnVisibilityChange: OnChangeFn<VisibilityState>
  onStatusToggle: (userId: string, userStatus: UserStatus) => void
  isLoading?: boolean
  buckets?: Bucket[]
}

export function UsersTable({
  data,
  columnVisibility,
  onColumnVisibilityChange,
  onStatusToggle,
  isLoading = false,
  buckets = [],
}: UsersTableProps) {
  const table = useReactTable({
    data,
    columns: columns(onStatusToggle, buckets),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange,
    state: {
      columnVisibility,
    },
  })

  // Loading 行渲染组件
  const LoadingRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={`loading-${index}`}>
        {columns(onStatusToggle, buckets).map((column) => (
          <TableCell key={column.id}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))
  }

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
        <TableCell
          colSpan={columns(onStatusToggle, buckets).length}
          className="h-24 text-center"
        >
          暂无数据
        </TableCell>
      </TableRow>
    )
  }

  return (
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
          <TableBody>{isLoading ? <LoadingRows /> : <TableRows />}</TableBody>
        </Table>
      </div>
    </div>
  )
}
