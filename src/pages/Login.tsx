import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModeToggle } from '@/components/mode-toggle'
import { NavLink, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const Login = () => {
  const title = import.meta.env.VITE_APP_TITLE
  const navigate = useNavigate()
  const { signIn, user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 如果用户已登录，重定向到首页
  useEffect(() => {
    if (!loading && user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('请填写所有必填字段')
      return
    }

    setSubmitting(true)
    const result = await signIn(email, password)

    if (result.success) {
      toast.success('登录成功')
      // 登录成功后，等待 AuthContext 更新状态，然后导航
      setTimeout(() => {
        navigate('/')
      }, 500)
    } else {
      toast.error(result.error || '登录失败，请检查您的凭据')
    }

    setSubmitting(false)
  }

  return (
    <section className='bg-muted flex h-screen items-center justify-center p-4'>
      {/* 模式切换按钮 */}
      <div className='absolute top-4 right-4'>
        <ModeToggle />
      </div>

      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='mb-6 text-center'>
          <h1 className='text-3xl font-bold'>{title}</h1>
        </div>

        {/* 登录表单卡片 */}
        <Card className='shadow-lg'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl'>登录</CardTitle>
            <CardDescription className='text-center'>
              输入您的邮箱和密码来登录账户
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>邮箱</Label>
              <Input
                id='email'
                type='email'
                placeholder='请输入您的邮箱'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>密码</Label>
              <Input
                id='password'
                type='password'
                placeholder='请输入您的密码'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className='text-right'>
              <NavLink
                to='/forgot-password'
                className='text-primary text-sm hover:underline'
              >
                忘记密码？
              </NavLink>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button
              type='submit'
              className='w-full'
              onClick={handleLogin}
              disabled={submitting}
            >
              {submitting ? '登录中...' : '登录'}
            </Button>

            <div className='text-muted-foreground text-center text-sm'>
              还没有账号？
              <NavLink
                to='/signup'
                className='text-primary ml-1 font-medium hover:underline'
              >
                去注册
              </NavLink>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export default Login
