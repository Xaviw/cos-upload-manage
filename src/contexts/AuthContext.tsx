import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import supabase from '@/utils/supabase'

interface User {
  id: string
  email: string
  name: string | null
  status: number // 0：禁用；1：启用
  role: number // 0：普通用户；1：管理员
  bucket_ids: string[]
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>
  signUp: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{
    success: boolean
    error?: string
    needsVerification?: boolean
    message?: string
  }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (email: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user?.email) {
        const userData = await fetchUserData(session.user.email)
        setUser(userData)
      } else {
        setUser(null)
      }

      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        const userData = await fetchUserData(session.user.email)
        setUser(userData)
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      // 登录成功后获取用户信息并设置上下文
      const userData = await fetchUserData(email)
      setUser(userData)

      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      // 创建认证用户
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (authError) throw authError

      // 检查是否返回了 session
      if (data.session) {
        // 如果有 session，说明是直接注册成功，获取用户信息并设置上下文
        const userData = await fetchUserData(email)
        setUser(userData)
        return { success: true, needsVerification: false }
      } else {
        // 没有 session，需要邮箱验证，返回提示信息
        return {
          success: true,
          needsVerification: true,
          message: '注册成功，请检查邮箱并验证后登录',
        }
      }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
    }
  }

  const updatePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      // 验证当前密码
      if (!user?.email) {
        throw new Error('用户未登录')
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (signInError) throw new Error('当前密码不正确')

      // 更新密码
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
