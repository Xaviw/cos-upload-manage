/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js"
import type { QueryData } from "@supabase/supabase-js"
import { toast } from "sonner"

/**
 * 请求包装方法
 * @param requestFn 返回 PostgrestFilterBuilder 的请求函数
 * @param config 配置对象，包含取消信号
 * @returns 请求结果
 */
export async function wrapperRequest<T>(
  requestFn: () => T,
  config: { signal?: AbortSignal } = {}
): Promise<QueryData<T>> {
  try {
    let query = requestFn() as PostgrestFilterBuilder<any, any, any, any>

    // 添加取消信号
    if (config.signal) {
      query = query.abortSignal(config.signal)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data
  } catch (err) {
    // 处理非 Supabase 错误
    if (err instanceof Error && err.name !== "AbortError") {
      toast.error(err.message)
    }
    throw err
  }
}
