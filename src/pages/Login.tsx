import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NavLink } from 'react-router'

const Login = () => {
  const heading = '登录'
  const title = import.meta.env.VITE_APP_TITLE
  const buttonText = '登录'
  const signupText = '还没有账号？'
  const signupUrl = '/signup'

  return (
    <section className='bg-muted h-screen'>
      <div className='flex h-full items-center justify-center'>
        {/* Logo */}
        <div className='flex flex-col items-center gap-6 lg:justify-start'>
          <h1 className='text-2xl font-bold'>{title}</h1>
          <div className='border-muted bg-background flex w-full max-w-sm min-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md'>
            {heading && <h1 className='text-xl font-semibold'>{heading}</h1>}
            <Input
              type='email'
              placeholder='邮箱'
              className='text-sm'
              required
            />
            <Input
              type='password'
              placeholder='密码'
              className='text-sm'
              required
            />
            <Button
              type='submit'
              className='w-full'
            >
              {buttonText}
            </Button>
          </div>
          <div className='text-muted-foreground flex justify-center gap-1 text-sm'>
            <p>{signupText}</p>
            <NavLink
              to={signupUrl}
              className='text-primary font-medium hover:underline'
            >
              去注册
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
