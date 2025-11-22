import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
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

import { FilePreviewDialog } from '@/components/FilePreviewDialog'
import { cn } from '@/lib/utils'
import {
  formatFileSize,
  getPreviewUrl,
  renderFilePreview,
  type FileItem,
} from '@/utils/fileUtils'

// 表单验证规则
const formSchema = z.object({
  version: z
    .string()
    .min(1, '版本号不能为空')
    .regex(/^v[\w.-]+$/, "版本号必须以v开头，支持'.'和'-'分隔符"),
  remark: z.string().optional(),
})

// 移动端文件卡片组件
const MobileFileCard = ({
  fileItem,
  removeFile,
  updateFilePath,
  onPreview,
}: {
  fileItem: FileItem
  removeFile: (id: string) => void
  updateFilePath: (id: string, newPath: string) => void
  onPreview: (file: File) => void
}) => (
  <div className='space-y-2 rounded-lg border p-3'>
    {/* 文件头部：图标、名称和操作 */}
    <div className='flex items-center justify-between'>
      <div className='flex min-w-0 flex-1 items-center space-x-2'>
        {renderFilePreview(fileItem, 'small', onPreview)}
        <span
          className='truncate text-sm font-medium'
          title={fileItem.file.name}
        >
          {fileItem.file.name}
        </span>
      </div>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        onClick={() => removeFile(fileItem.id)}
        className='h-6 w-6 shrink-0 text-red-500 hover:bg-red-50 hover:text-red-700'
      >
        <X className='h-3 w-3' />
      </Button>
    </div>

    {/* 文件详情 */}
    <div className='space-y-2 text-xs'>
      {/* 路径输入 */}
      <div className='flex items-center space-x-2'>
        <span className='min-w-8 text-gray-500'>路径:</span>
        <Input
          value={fileItem.path}
          onChange={(e) => updateFilePath(fileItem.id, e.target.value)}
          placeholder='/'
          className='h-7 flex-1 text-xs'
        />
      </div>

      {/* 文件信息 */}
      <div className='flex items-center justify-between text-gray-500'>
        <span>类型: {fileItem.file.type || '未知'}</span>
        <span>大小: {formatFileSize(fileItem.file.size)}</span>
      </div>
    </div>
  </div>
)

// 桌面端文件列表组件
const DesktopFileTable = ({
  files,
  removeFile,
  updateFilePath,
  onPreview,
}: {
  files: FileItem[]
  removeFile: (id: string) => void
  updateFilePath: (id: string, newPath: string) => void
  onPreview: (file: File) => void
}) => {
  // 表格列配置
  const columns = [
    {
      key: 'path',
      label: '路径',
      render: (fileItem: FileItem) => (
        <Input
          value={fileItem.path}
          onChange={(e) => updateFilePath(fileItem.id, e.target.value)}
          placeholder='/'
          className='h-8 w-full'
        />
      ),
    },
    {
      key: 'name',
      label: '文件名',
      render: (fileItem: FileItem) => (
        <div
          className='max-w-[200px] truncate text-sm font-medium text-gray-900 dark:text-gray-100'
          title={fileItem.file.name}
        >
          {fileItem.file.name}
        </div>
      ),
    },
    {
      key: 'preview',
      label: '类型',
      render: (fileItem: FileItem) =>
        renderFilePreview(fileItem, 'medium', onPreview),
    },
    {
      key: 'size',
      label: '大小',
      render: (fileItem: FileItem) => (
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {formatFileSize(fileItem.file.size)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '操作',
      render: (fileItem: FileItem) => (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => removeFile(fileItem.id)}
          className='h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700'
        >
          <X className='h-4 w-4' />
        </Button>
      ),
    },
  ]

  return (
    <div className='hidden overflow-x-auto rounded-md border md:block'>
      <table className='w-full min-w-[600px]'>
        <thead className='bg-gray-50 dark:bg-gray-800'>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className='px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase'
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900'>
          {files.map((fileItem) => (
            <tr
              key={fileItem.id}
              className='hover:bg-gray-50 dark:hover:bg-gray-800'
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className='px-3 py-2 whitespace-nowrap'
                >
                  {column.render(fileItem)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 快捷路径选项
const QUICK_PATHS = ['/a/b/c/']

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: '',
      remark: '',
    },
  })

  // 处理文件选择
  const handleFileSelect = (selectedFiles: FileList) => {
    const newFiles: FileItem[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substring(2, 15),
      file,
      path: '/',
      url: getPreviewUrl(file),
    }))

    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  // 处理文件拖拽
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  // 删除文件
  const removeFile = (id: string) => {
    setFiles((prevFiles) => {
      const file = prevFiles.find((f) => f.id === id)
      if (file && file.url) {
        URL.revokeObjectURL(file.url)
      }
      return prevFiles.filter((f) => f.id !== id)
    })
  }

  // 更新文件路径
  const updateFilePath = (id: string, newPath: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id ? { ...file, path: newPath } : file,
      ),
    )
  }

  // 应用快捷路径
  const applyQuickPath = (path: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => ({
        ...file,
        path: path,
      })),
    )
  }

  // 文件预览处理函数
  const handlePreview = (file: File) => {
    setPreviewFile(file)
  }
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = {
      ...values,
      files: files.map(({ file, path, ...rest }) => ({
        ...rest,
        name: file.name,
        size: file.size,
        type: file.type,
        path: path,
      })),
    }

    console.log('提交的表单数据:', formData)
    alert('表单提交成功，请查看控制台输出')
  }

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8 md:py-12'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>文件上传管理</CardTitle>
          <CardDescription>
            请填写版本信息并上传文件，支持拖拽和点选上传
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              {/* 版本号输入 */}
              <FormField
                control={form.control}
                name='version'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>版本号</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='请输入版本号，例如 v1.0.0.0'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 文件上传区域 */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <FormLabel>文件</FormLabel>
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground text-sm'>
                      快捷路径:
                    </span>
                    <div className='flex gap-1'>
                      {QUICK_PATHS.map((path) => (
                        <Button
                          key={path}
                          variant='outline'
                          size='sm'
                          onClick={() => applyQuickPath(path)}
                          className='h-8 px-3 text-xs'
                        >
                          {path}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-gray-400',
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className='text-muted-foreground mx-auto mb-3 h-10 w-10' />
                  <p className='text-muted-foreground mb-1'>
                    拖拽文件到此处或点击选择文件
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    支持任意类型、任意大小、任意数量的文件
                  </p>
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    className='hidden'
                    onChange={(e) =>
                      e.target.files && handleFileSelect(e.target.files)
                    }
                  />
                </div>

                {/* 文件列表 - 紧凑型表格 */}
                {files.length > 0 && (
                  <div className='space-y-2'>
                    <p className='text-sm font-medium'>已选择的文件:</p>
                    {/* 移动端卡片布局 */}
                    <div className='space-y-2 md:hidden'>
                      {files.map((fileItem) => (
                        <MobileFileCard
                          key={fileItem.id}
                          fileItem={fileItem}
                          removeFile={removeFile}
                          updateFilePath={updateFilePath}
                          onPreview={handlePreview}
                        />
                      ))}
                    </div>

                    {/* 桌面端表格布局 */}
                    <DesktopFileTable
                      files={files}
                      removeFile={removeFile}
                      updateFilePath={updateFilePath}
                      onPreview={handlePreview}
                    />
                  </div>
                )}
              </div>

              {/* 备注输入 */}
              <FormField
                control={form.control}
                name='remark'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>备注</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='特殊说明请在此备注'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 提交按钮 - 居中 */}
              <div className='flex justify-center'>
                <Button
                  type='submit'
                  className='w-full md:w-auto'
                  disabled={files.length === 0}
                >
                  上传
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 文件预览弹窗 */}
      {previewFile && (
        <FilePreviewDialog
          file={previewFile}
          open={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  )
}
