import { useState, useMemo } from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  Search,
  RotateCcw,
  User,
  UserCheck,
  UserX,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// 定义用户类型
export interface User {
  id: string
  username: string
  email: string
  status: 'active' | 'inactive'
  registrationTime: Date
}

// 状态枚举和映射
const STATUS_MAP = {
  active: {
    label: '启用',
    icon: UserCheck,
    variant: 'default' as const,
  },
  inactive: {
    label: '禁用',
    icon: UserX,
    variant: 'destructive' as const,
  },
}

export default function UserManagement() {
  // 用户数据（这里暂时使用空数组，实际应该从API获取）
  const [data] = useState<User[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 筛选器状态
  const [filterUsername, setFilterUsername] = useState<string>('')
  const [filterEmail, setFilterEmail] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  // 应用筛选器
  const filteredData = useMemo(() => {
    return data.filter((user) => {
      // 用户名筛选
      if (filterUsername && !user.username.includes(filterUsername)) {
        return false
      }

      // 邮箱筛选
      if (filterEmail && !user.email.includes(filterEmail)) {
        return false
      }

      // 状态筛选
      if (filterStatus && user.status !== filterStatus) {
        return false
      }

      return true
    })
  }, [data, filterUsername, filterEmail, filterStatus])

  // 计算分页数据
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, pageSize])

  // 计算总页数
  const totalPages = Math.ceil(filteredData.length / pageSize)

  // 重置筛选器
  const resetFilters = () => {
    setFilterUsername('')
    setFilterEmail('')
    setFilterStatus('')
    setColumnFilters([])
  }

  // 处理用户状态切换
  const toggleUserStatus = (userId: string) => {
    // 这里应该调用API来切换用户状态
    console.log(`Toggle status for user ${userId}`)
  }

  // 表格列定义
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'username',
      header: '用户名',
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue('username')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: '用户邮箱',
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'registrationTime',
      header: '注册时间',
      cell: ({ row }) => (
        <div>
          {format(row.getValue('registrationTime'), 'yyyy-MM-dd HH:mm:ss')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: '用户状态',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof STATUS_MAP
        const statusInfo = STATUS_MAP[status]
        const StatusIcon = statusInfo.icon

        return (
          <Badge
            variant={statusInfo.variant}
            className='flex items-center gap-1'
          >
            <StatusIcon className='h-3 w-3' />
            {statusInfo.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const user = row.original
        const isActive = user.status === 'active'

        return (
          <Button
            onClick={() => toggleUserStatus(user.id)}
            variant={isActive ? 'outline' : 'default'}
            size='sm'
          >
            {isActive ? '禁用' : '启用'}
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data: paginatedData,
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

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 处理页码输入
  const handlePageInput = (value: string) => {
    const page = parseInt(value, 10)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // 处理页面大小变化
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize, 10))
    setCurrentPage(1) // 重置到第一页
  }

  return (
    <div className='px-4 py-8'>
      <Card>
        <CardHeader>
          <CardTitle>用户管理</CardTitle>
          <CardDescription>管理系统中的所有用户账户</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* 筛选器部分 */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5'>
            {/* 用户名筛选 */}
            <div>
              <label className='mb-2 block text-sm font-medium'>用户名</label>
              <Input
                placeholder='请输入用户名'
                value={filterUsername}
                onChange={(e) => setFilterUsername(e.target.value)}
              />
            </div>

            {/* 邮箱筛选 */}
            <div>
              <label className='mb-2 block text-sm font-medium'>用户邮箱</label>
              <Input
                placeholder='请输入邮箱'
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
              />
            </div>

            {/* 状态筛选 */}
            <div>
              <label className='mb-2 block text-sm font-medium'>用户状态</label>
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='请选择状态' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>全部</SelectItem>
                  <SelectItem value='active'>启用</SelectItem>
                  <SelectItem value='inactive'>禁用</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 操作按钮 */}
            <div className='flex items-end space-x-2'>
              <Button
                onClick={() => {}} // 实际应用中这里应该执行搜索操作
                className='flex items-center gap-2'
              >
                <Search className='h-4 w-4' />
                搜索
              </Button>
              <Button
                variant='outline'
                onClick={resetFilters}
                className='flex items-center gap-2'
              >
                <RotateCcw className='h-4 w-4' />
                重置
              </Button>
            </div>
          </div>

          {/* 表格部分 */}
          <div className='space-y-4'>
            <div className='flex items-center justify-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='ml-auto'
                  >
                    列显示 <MoreHorizontal className='ml-2 h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className='capitalize'
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id === 'username'
                            ? '用户名'
                            : column.id === 'email'
                              ? '用户邮箱'
                              : column.id === 'registrationTime'
                                ? '注册时间'
                                : column.id === 'status'
                                  ? '用户状态'
                                  : column.id === 'actions'
                                    ? '操作'
                                    : column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className='rounded-md border'>
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
                                  header.getContext(),
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-24 text-center'
                      >
                        暂无数据
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 分页部分 */}
            <div className='flex items-center justify-between px-2'>
              <div className='flex items-center space-x-2'>
                <p className='text-sm font-medium'>每页显示</p>
                <Select
                  value={`${pageSize}`}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className='h-8 w-[70px]'>
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side='top'>
                    {[10, 20, 30, 40, 50].map((size) => (
                      <SelectItem
                        key={size}
                        value={`${size}`}
                      >
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className='text-muted-foreground text-sm'>
                  共 {filteredData.length} 条记录
                </p>
              </div>

              <div className='flex items-center space-x-6 lg:space-x-8'>
                <div className='flex items-center space-x-2'>
                  <p className='text-sm font-medium'>第</p>
                  <div className='flex items-center'>
                    <Input
                      type='number'
                      min={1}
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => handlePageInput(e.target.value)}
                      className='h-8 w-16 text-center'
                    />
                  </div>
                  <p className='text-sm font-medium'>页，共 {totalPages} 页</p>
                </div>

                <div className='flex items-center space-x-2'>
                  <Button
                    variant='outline'
                    className='hidden h-8 w-8 p-0 lg:flex'
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <span className='sr-only'>Go to first page</span>
                    <ChevronsLeft className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    className='h-8 w-8 p-0'
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span className='sr-only'>Go to previous page</span>
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    className='h-8 w-8 p-0'
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <span className='sr-only'>Go to next page</span>
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    className='hidden h-8 w-8 p-0 lg:flex'
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <span className='sr-only'>Go to last page</span>
                    <ChevronsRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
