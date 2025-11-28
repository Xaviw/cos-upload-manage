import type { Database } from "./supabase"

export type User = Database["public"]["Tables"]["users"]["Row"]
