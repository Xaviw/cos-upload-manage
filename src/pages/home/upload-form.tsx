import { type FileItem } from "@/utils/fileUtils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
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

import { FileFormField } from "./file-form-field"

// 表单验证规则
const formSchema = z.object({
  version: z
    .string()
    .min(1, "版本号不能为空")
    .regex(/^v[\w.-]+$/, "版本号必须以v开头，支持'.'和'-'分隔符"),
  files: z.array(z.any()).min(1, "请至少选择一个文件"),
  remark: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export interface UploadFormProps {
  onSubmit?: (values: FormValues & { files: FileItem[] }) => void
}

export const UploadForm = ({ onSubmit }: UploadFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: "",
      remark: "",
      files: [],
    },
  })

  const handleSubmit: SubmitHandler<FormValues> = (values) => {
    onSubmit?.(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* 版本号输入 */}
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>版本号</FormLabel>
              <FormControl>
                <Input placeholder="版本号 (如: v1.0.0)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 备注输入 */}
        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>备注</FormLabel>
              <FormControl>
                <Input placeholder="备注 (可选)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 文件选择字段 */}
        <FileFormField control={form.control} name="files" />

        {/* 提交按钮 */}
        <Button type="submit" className="w-full">
          上传文件
        </Button>
      </form>
    </Form>
  )
}
