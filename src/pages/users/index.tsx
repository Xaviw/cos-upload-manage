import { useCallback, useEffect, useRef, useState } from "react"
import {
  fetchBuckets as apiFetchBuckets,
  fetchUsers as apiFetchUsers,
  updateUserStatus,
} from "@/apis/users"
import { type VisibilityState } from "@tanstack/react-table"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import {
  type Bucket,
  type SearchFormValues,
  type User,
  type UserStatus,
} from "./config"
import { SearchForm } from "./search-form"
import { UsersTable } from "./users-table"

export default function UserManagement() {
  const [data, setData] = useState<User[]>([])
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // 获取存储桶数据
  const fetchBuckets = useCallback(() => {
    apiFetchBuckets(abortControllerRef.current?.signal).then((bucketsData) =>
      setBuckets(bucketsData)
    )
  }, [])

  // 获取用户数据的通用方法
  const fetchUsers = useCallback((filters: Partial<SearchFormValues> = {}) => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    apiFetchUsers(
      {
        name: filters.name,
        email: filters.email,
        role: filters.role,
        status: filters.status,
      },
      abortControllerRef.current.signal
    )
      .then((users) => setData(users))
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // 初始化加载数据
  useEffect(() => {
    fetchUsers()
    fetchBuckets()

    // 清理函数：组件卸载时取消未完成的请求
    return () => {
      abortControllerRef.current?.abort?.()
    }
  }, [fetchUsers, fetchBuckets])

  // 重置筛选器
  const resetFilters = () => {
    // 重新获取所有用户数据，不应用任何筛选条件
    fetchUsers()
  }

  // 处理用户状态切换
  const handleStatusToggle = async (userId: string, userStatus: UserStatus) => {
    updateUserStatus(userId, userStatus)
  }

  // 处理搜索
  const handleSearch = (filters: SearchFormValues) => {
    // 使用筛选条件获取用户数据
    fetchUsers(filters)
  }

  return (
    <Card className="m-4 lg:m-8">
      <CardHeader>
        <CardTitle>用户管理</CardTitle>
        <CardDescription>管理系统中的所有用户账户</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 筛选器部分 */}
        <SearchForm onSearch={handleSearch} onReset={resetFilters} />

        <Separator />

        {/* 表格部分 */}
        <UsersTable
          data={data}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          onStatusToggle={handleStatusToggle}
          isLoading={isLoading}
          buckets={buckets}
        />
      </CardContent>
    </Card>
  )
}
