import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react"
import type { User } from "@/types"
import supabase from "@/utils/supabase"
import type { Session } from "@supabase/supabase-js"

const SessionContext = createContext<{
  session: Session | null
  userInfoLoading: boolean
  userInfo: User | null
}>({
  session: null,
  userInfoLoading: false,
  userInfo: null,
})

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [userInfoLoading, setUserInfoLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<User | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case "SIGNED_OUT":
          setSession(null)
          break
        case "PASSWORD_RECOVERY":
          break
        default:
          setSession(session)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const email = session?.user?.email
    if (!email) {
      setUserInfo(null)
      return
    }

    async function fetchUserInfo() {
      try {
        setUserInfoLoading(true)
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("email", email!)

        if (error) throw error
        setUserInfo(data[0])
      } finally {
        setUserInfoLoading(false)
      }
    }

    fetchUserInfo()
  }, [session])

  return (
    <SessionContext.Provider value={{ session, userInfoLoading, userInfo }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSessionContext must be used within an AuthProvider")
  }
  return context
}
