import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react"

type LoginFormType = "login" | "register" | "reset"

interface LoginContextType {
  formType: LoginFormType
  setFormType: (formType: LoginFormType) => void
}

const DEFAULT_STATE: LoginFormType = "login"

const LoginContext = createContext<LoginContextType | null>(null)

export const useLoginContext = () => {
  const context = useContext(LoginContext)
  if (!context) {
    throw new Error("useLoginContext must be used within LoginProvider")
  }
  return context
}

export const LoginProvider = ({ children }: PropsWithChildren) => {
  const [formType, setFormType] = useState<LoginFormType>(DEFAULT_STATE)

  return (
    <LoginContext.Provider value={{ formType, setFormType }}>
      {children}
    </LoginContext.Provider>
  )
}
