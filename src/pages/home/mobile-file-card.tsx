import {
  formatFileSize,
  renderFilePreview,
  type FileItem,
} from "@/utils/fileUtils"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MobileFileCardProps {
  fileItem: FileItem
  removeFile: (id: string) => void
  updateFilePath: (id: string, newPath: string) => void
  onPreview: (file: File) => void
}

export const MobileFileCard = ({
  fileItem,
  removeFile,
  updateFilePath,
  onPreview,
}: MobileFileCardProps) => (
  <div className="space-y-2 rounded-lg border p-3">
    {/* 文件头部：图标、名称和操作 */}
    <div className="flex items-center justify-between">
      <div className="flex min-w-0 flex-1 items-center space-x-2">
        {renderFilePreview(fileItem, "small", onPreview)}
        <span
          className="truncate text-sm font-medium"
          title={fileItem.file.name}
        >
          {fileItem.file.name}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => removeFile(fileItem.id)}
        className="h-6 w-6 shrink-0 text-red-500 hover:bg-red-50 hover:text-red-700"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>

    {/* 文件详情 */}
    <div className="space-y-2 text-xs">
      {/* 路径输入 */}
      <div className="flex items-center space-x-2">
        <span className="min-w-8 text-gray-500">路径:</span>
        <Input
          value={fileItem.path}
          onChange={(e) => updateFilePath(fileItem.id, e.target.value)}
          placeholder="/"
          className="h-7 flex-1 text-xs"
        />
      </div>

      {/* 文件信息 */}
      <div className="flex items-center justify-between text-gray-500">
        <span>类型: {fileItem.file.type || "未知"}</span>
        <span>大小: {formatFileSize(fileItem.file.size)}</span>
      </div>
    </div>
  </div>
)
