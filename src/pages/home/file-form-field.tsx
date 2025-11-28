import { useState } from "react"
import { randomId } from "@/utils"
import { getPreviewUrl, type FileItem } from "@/utils/fileUtils"
import { Upload } from "lucide-react"
import type { Control, FieldPath, FieldValues } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FilePreviewDialog } from "@/components/file-preview-dialog"

import { DesktopFileTable } from "./desktop-file-table"
import { MobileFileCard } from "./mobile-file-card"

interface FileFormFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  name: FieldPath<T>
}

interface FileField {
  onChange: (value: FileItem[]) => void
  value: FileItem[]
}

export const FileFormField = <T extends FieldValues = FieldValues>({
  control,
  name,
}: FileFormFieldProps<T>) => {
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // 快捷路径选项
  const quickPaths = ["/a/b/c"]

  // 文件选择处理
  const handleFileSelect = (fileList: FileList, field: FileField) => {
    const newFiles: FileItem[] = Array.from(fileList).map((file) => ({
      id: randomId(),
      file,
      path: "/",
      url: getPreviewUrl(file),
    }))

    field.onChange([...field.value, ...newFiles])
  }

  // 文件移除处理
  const handleRemoveFile = (id: string, field: FileField) => {
    const updatedFiles = field.value.filter((f: FileItem) => {
      if (f && f.url) {
        URL.revokeObjectURL(f.url)
      }
      return f.id !== id
    })
    field.onChange(updatedFiles)
  }

  // 文件路径更新处理
  const handleUpdateFilePath = (
    id: string,
    newPath: string,
    field: FileField
  ) => {
    const updatedFiles = field.value.map((f: FileItem) =>
      f.id === id ? { ...f, path: newPath } : f
    )
    field.onChange(updatedFiles)
  }

  // 快捷路径处理 - 设置所有已选择文件的路径
  const handleSetQuickPath = (quickPath: string, field: FileField) => {
    if (!field.value || field.value.length === 0) return

    const updatedFiles = field.value.map((f: FileItem) => ({
      ...f,
      path: quickPath,
    }))
    field.onChange(updatedFiles)
  }

  // 文件预览处理
  const handlePreview = (file: File) => {
    setPreviewFile(file)
    setShowPreview(true)
  }

  const handleClosePreview = () => {
    setShowPreview(false)
    setPreviewFile(null)
  }

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  // 文件输入点击处理
  const handleFileInputClick = (field: FileField) => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        handleFileSelect(target.files, field)
      }
    }
    input.click()
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center justify-between">
            <span>选择文件</span>
            <div className="flex items-center gap-2">
              <span>快捷路径：</span>
              {quickPaths.map((path, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSetQuickPath(path, field)}
                >
                  {path}
                </Badge>
              ))}
            </div>
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              {/* 文件上传区域 */}
              <div
                className={cn(
                  "cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-gray-400"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFileSelect(e.dataTransfer.files, field)
                  }
                }}
                onClick={() => handleFileInputClick(field)}
              >
                <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 text-muted-foreground">
                  拖拽文件到此处或点击选择文件
                </p>
                <p className="text-xs text-muted-foreground">
                  支持任意类型、任意大小、任意数量的文件
                </p>
              </div>

              {/* 已选择文件计数 */}
              {field.value && field.value.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    已选择 {field.value.length} 个文件
                  </span>
                </div>
              )}

              {/* 文件列表 */}
              {field.value && field.value.length > 0 && (
                <div className="space-y-4">
                  {/* 移动端文件卡片 */}
                  <div className="grid gap-3 md:hidden">
                    {field.value.map((fileItem: FileItem) => (
                      <MobileFileCard
                        key={fileItem.id}
                        fileItem={fileItem}
                        removeFile={(id) => handleRemoveFile(id, field)}
                        updateFilePath={(id, newPath) =>
                          handleUpdateFilePath(id, newPath, field)
                        }
                        onPreview={handlePreview}
                      />
                    ))}
                  </div>

                  {/* 桌面端文件表格 */}
                  <DesktopFileTable
                    files={field.value}
                    removeFile={(id) => handleRemoveFile(id, field)}
                    updateFilePath={(id, newPath) =>
                      handleUpdateFilePath(id, newPath, field)
                    }
                    onPreview={handlePreview}
                  />
                </div>
              )}

              {/* 预览弹窗 */}
              {previewFile && (
                <FilePreviewDialog
                  file={previewFile}
                  open={showPreview}
                  onClose={handleClosePreview}
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
