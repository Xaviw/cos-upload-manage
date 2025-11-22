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

const ForgotPassword = () => {
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

        {/* 忘记密码表单卡片 */}
        <Card className='shadow-lg'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl'>忘记密码</CardTitle>
            <CardDescription className='text-center'>
              输入您的邮箱，我们将向您发送重置密码的链接
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>邮箱</Label>
              <Input
                id='email'
                type='email'
                placeholder='请输入您的邮箱地址'
                required
              />
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button
              type='submit'
              className='w-full'
              onClick={() => navigate('/login')}
            >
              发送重置链接
            </Button>

            <div className='text-muted-foreground text-center text-sm'>
              记起密码了？
              <NavLink
                to='/login'
                className='text-primary ml-1 font-medium hover:underline'
              >
                返回登录
              </NavLink>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

export default ForgotPassword
