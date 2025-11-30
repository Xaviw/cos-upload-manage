import supabase from "@/utils/supabase"
import { wrapperRequest } from "@/apis"
import type { Tables } from "@/types/supabase"

/**
 * 类型推断示例 - 获取存储桶列表
 */
export async function fetchBuckets() {
  // TypeScript 会自动推断出返回类型为 Tables<'buckets'>[]
  return wrapperRequest(() => supabase.from("buckets").select("*"))
}

/**
 * 类型推断示例 - 获取单个存储桶
 */
export async function fetchBucketById(id: string) {
  // TypeScript 会自动推断出返回类型为 Tables<'buckets'>
  return wrapperRequest(() => 
    supabase.from("buckets").select("*").eq("id", id).single()
  )
}

/**
 * 类型推断示例 - 获取文件列表
 */
export async function fetchFiles() {
  // TypeScript 会自动推断出返回类型为 Tables<'files'>[]
  return wrapperRequest(() => supabase.from("files").select("*"))
}

/**
 * 类型推断示例 - 带条件查询
 */
export async function fetchFilesByUserId(userId: string) {
  // TypeScript 会自动推断出返回类型为 Tables<'files'>[]
  return wrapperRequest(() => 
    supabase.from("files").select("*").eq("user_id", userId)
  )
}

// 使用示例 - 类型推断测试
async function testTypeInference() {
  // buckets 类型被自动推断为 Tables<'buckets'>[]
  const buckets = await fetchBuckets()
  
  if (buckets && buckets.length > 0) {
    // firstBucket 类型为 Tables<'buckets'>，具有完整的类型提示
    const firstBucket = buckets[0]
    console.log(firstBucket.id) // 类型安全访问
    console.log(firstBucket.bucket) // 类型安全访问
  }
  
  // bucket 类型被自动推断为 Tables<'buckets'>
  const bucket = await fetchBucketById("some-id")
  if (bucket) {
    console.log(bucket.domain) // 类型安全访问
  }
  
  // files 类型被自动推断为 Tables<'files'>[]
  const files = await fetchFilesByUserId("user-id")
  if (files) {
    files.map(file => ({
      id: file.id, // 类型安全访问
      name: file.name, // 类型安全访问
      size: file.size // 类型安全访问
    }))
  }
}

/**
 * 辅助函数：提取请求类型
 * 使用这个函数可以帮助你在代码中获取推断出的类型
 */
type ExtractRequestReturnType<T> = T extends Promise<infer U> ? U : T

// 类型提取示例
type BucketsType = ExtractRequestReturnType<ReturnType<typeof fetchBuckets>>
type BucketType = ExtractRequestReturnType<ReturnType<typeof fetchBucketById>>
type FilesType = ExtractRequestReturnType<ReturnType<typeof fetchFiles>>

// 这些类型现在可以在其他地方使用
function processBuckets(buckets: BucketsType) {
  return buckets.map(bucket => ({
    id: bucket.id,
    name: bucket.bucket
  }))
}