import { type UserStatus } from "@/pages/users/config"
import type { UserUpdate } from "@/types"
import supabase from "@/utils/supabase"

import { wrapperRequest } from "./index"

/**
 * 获取用户列表
 * @param filters 筛选条件
 * @param signal 取消信号
 * @returns 用户列表
 */
export async function fetchUsers(
  filters: Pick<UserUpdate, "name" | "email" | "role" | "status"> = {},
  signal?: AbortSignal
) {
  return wrapperRequest(
    () => {
      let query = supabase.from("users").select("*")

      // 应用筛选条件
      if (filters.name) {
        query = query.ilike("name", `%${filters.name}%`)
      }

      if (filters.email) {
        query = query.ilike("email", `%${filters.email}%`)
      }

      if (filters.role) {
        query = query.eq("role", filters.role)
      }

      if (filters.status) {
        query = query.eq("status", filters.status)
      }

      // 按注册时间降序排列
      query = query.order("created_at", { ascending: false })

      return query
    },
    { signal }
  )
}

/**
 * 更新用户状态
 * @param userId 用户ID
 * @param status 新状态
 * @returns 更新结果
 */
export async function updateUserStatus(
  userId: string,
  status: UserStatus,
  signal?: AbortSignal
) {
  return wrapperRequest(
    () =>
      supabase
        .from("users")
        .update({
          status,
        })
        .eq("id", userId),
    { signal }
  )
}

/**
 * 获取存储桶列表
 * @returns 存储桶列表
 */
export async function fetchBuckets(signal?: AbortSignal) {
  return wrapperRequest(() => supabase.from("buckets").select("*"), {
    signal,
  })
}
