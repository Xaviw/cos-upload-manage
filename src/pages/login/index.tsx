import { useSessionContext } from "@/contexts/session-provider"
import { Navigate } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ModeToggle } from "@/components/theme/mode-toggle"

import { LoginForm } from "./login-form"
import { LoginProvider, useLoginContext } from "./provider"
import { RegisterForm } from "./register-form"
import { ResetForm } from "./reset-form"

const LoginContent = () => {
  const { session } = useSessionContext()
  const { formType, setFormType } = useLoginContext()

  if (session) {
    return <Navigate to="/" replace />
  }

  const title = import.meta.env.VITE_APP_TITLE

  const getFormTitle = () => {
    switch (formType) {
      case "login":
        return "登录"
      case "register":
        return "注册"
      case "reset":
        return "忘记密码"
    }
  }

  const getFormDescription = () => {
    switch (formType) {
      case "login":
        return "输入您的邮箱和密码来登录账户"
      case "register":
        return "创建一个新账户来开始使用"
      case "reset":
        return "输入您的邮箱，我们将向您发送重置密码的链接"
    }
  }

  const renderForm = () => {
    switch (formType) {
      case "login":
        return (
          <div className="space-y-4">
            <LoginForm />
            <div className="text-right">
              <Button
                variant="link"
                size="sm"
                onClick={() => setFormType("reset")}
              >
                忘记密码？
              </Button>
            </div>
          </div>
        )
      case "register":
        return <RegisterForm />
      case "reset":
        return <ResetForm />
    }
  }

  const renderFooter = () => {
    switch (formType) {
      case "login":
        return (
          <div className="text-center text-sm text-muted-foreground">
            还没有账号？
            <Button
              variant="link"
              className="ml-1 font-medium"
              onClick={() => setFormType("register")}
            >
              去注册
            </Button>
          </div>
        )
      case "register":
        return (
          <div className="text-center text-sm text-muted-foreground">
            已经有账号？
            <Button
              variant="link"
              className="ml-1 font-medium"
              onClick={() => setFormType("login")}
            >
              去登录
            </Button>
          </div>
        )
      case "reset":
        return (
          <div className="text-center text-sm text-muted-foreground">
            记起密码了？
            <Button
              variant="link"
              className="ml-1 font-medium"
              onClick={() => setFormType("login")}
            >
              返回登录
            </Button>
          </div>
        )
    }
  }

  return (
    <section className="flex h-screen items-center justify-center bg-muted p-4">
      {/* 模式切换按钮 */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        {/* 表单卡片 */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              {getFormTitle()}
            </CardTitle>
            <CardDescription className="text-center">
              {getFormDescription()}
            </CardDescription>
          </CardHeader>

          <CardContent>{renderForm()}</CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {renderFooter()}
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

const LoginPage = () => {
  return (
    <LoginProvider>
      <LoginContent />
    </LoginProvider>
  )
}

export default LoginPage
