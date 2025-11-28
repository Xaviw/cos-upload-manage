import { useState } from "react"
import supabase from "@/utils/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.email({
    message: "请输入有效的邮箱地址",
  }),
  password: z.string().min(1, {
    message: "密码不能为空",
  }),
})

type LoginFormValues = z.infer<typeof formSchema>

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        ...values,
      })

      if (error) {
        toast.error(error.message || "登录失败，请检查您的用户名和密码")
      } else {
        toast.success("登录成功")
      }
    } catch (error) {
      toast.error("登录过程中发生错误，请稍后重试")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入您的邮箱"
                  type="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入您的密码"
                  type="password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Button
        type="submit"
        className="mt-6 w-full"
        disabled={isLoading}
        onClick={form.handleSubmit(handleSubmit)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            登录中...
          </>
        ) : (
          "登录"
        )}
      </Button>
    </Form>
  )
}
