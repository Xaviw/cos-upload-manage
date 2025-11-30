/**
 * TypeScript 类型推断示例
 * 
 * 这个文件展示了如何使用 wrapperRequest 函数实现自动类型推断，
 * 以及如何在后续代码中使用这些推断出的类型。
 */

// 1. 定义一个类型提取辅助函数
type ExtractRequestReturnType<T> = T extends Promise<infer U> ? U : T

// 2. 使用 wrapperRequest 的函数
import { wrapperRequest } from "@/apis"
import supabase from "@/utils/supabase"

// 3. 定义 API 函数，TypeScript 会自动推断返回类型
export async function fetchBuckets() {
  return wrapperRequest(() => supabase.from("buckets").select("*"))
}

export async function fetchFiles() {
  return wrapperRequest(() => supabase.from("files").select("*"))
}

// 4. 提取推断出的类型，以便在其他地方使用
export type BucketType = ExtractRequestReturnType<ReturnType<typeof fetchBuckets>>
export type FileType = ExtractRequestReturnType<ReturnType<typeof fetchFiles>>

// 5. 在其他组件中使用这些类型
export function processBuckets(buckets: BucketType) {
  // buckets 现在有了正确的类型提示
  return buckets.map(bucket => ({
    id: bucket.id,
    name: bucket.bucket,
    domain: bucket.domain
  }))
}

export function processFiles(files: FileType) {
  // files 现在有了正确的类型提示
  return files.map(file => ({
    id: file.id,
    name: file.name,
    size: file.size,
    status: file.status
  }))
}

// 6. 实际使用示例
export async function exampleUsage() {
  // 获取数据，类型自动推断
  const buckets = await fetchBuckets()
  const files = await fetchFiles()
  
  // 处理数据，类型安全
  const processedBuckets = processBuckets(buckets)
  const processedFiles = processFiles(files)
  
  return {
    buckets: processedBuckets,
    files: processedFiles
  }
}