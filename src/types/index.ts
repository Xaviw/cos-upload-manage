import type { Database } from "./supabase"

export type User = Database["public"]["Tables"]["users"]["Row"]
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"]
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"]
export type Bucket = Database["public"]["Tables"]["buckets"]["Row"]
