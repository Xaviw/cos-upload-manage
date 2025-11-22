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

const Login = () => {
  const title = import.meta.env.VITE_APP_TITLE
  const navigate = useNavigate()

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
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>密码</Label>
              <Input
                id='password'
                type='password'
                placeholder='请输入您的密码'
                required
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
              onClick={() => navigate('/')}
            >
              登录
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
