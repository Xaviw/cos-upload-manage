import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ModeToggle } from '@/components/mode-toggle'
import { NavLink, useNavigate } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

// 定义表单验证模式
const formSchema = z
  .object({
    name: z.string().min(2, {
      message: '用户名至少需要2个字符',
    }),
    email: z.string().email({
      message: '请输入有效的邮箱地址',
    }),
    password: z.string().min(6, {
      message: '密码至少需要6个字符',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

const Signup = () => {
  const title = import.meta.env.VITE_APP_TITLE
  const navigate = useNavigate()
  const { signUp } = useAuth()

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // 表单提交处理
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await signUp(values.email, values.password, values.name)

    if (!result.success) {
      toast.error(result.error || '注册失败')
      return
    }

    if (result.needsVerification) {
      // 需要邮箱验证
      toast.success(result.message || '注册成功，请检查邮箱并验证后登录')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } else {
      // 注册成功并自动登录
      toast.success('注册成功！')
      setTimeout(() => {
        navigate('/')
      }, 500)
    }
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

        {/* 注册表单卡片 */}
        <Card className='shadow-lg'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl'>注册</CardTitle>
            <CardDescription className='text-center'>
              创建一个新账户来开始使用
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='请输入您的用户名'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='请输入您的邮箱'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='请设置您的密码'
                        type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>确认密码</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='请再次输入您的密码'
                        type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className='flex flex-col space-y-4'>
              <Button
                type='submit'
                className='w-full'
                onClick={form.handleSubmit(onSubmit)}
              >
                注册
              </Button>

              <div className='text-muted-foreground text-center text-sm'>
                已经有账号？
                <NavLink
                  to='/login'
                  className='text-primary ml-1 font-medium hover:underline'
                >
                  去登录
                </NavLink>
              </div>
            </CardFooter>
          </Form>
        </Card>
      </div>
    </section>
  )
}

export default Signup
