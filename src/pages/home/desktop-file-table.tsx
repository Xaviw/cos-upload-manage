import type { ReactElement } from "react"
import {
  formatFileSize,
  renderFilePreview,
  type FileItem,
} from "@/utils/fileUtils"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DesktopFileTableProps {
  files: FileItem[]
  removeFile: (id: string) => void
  updateFilePath: (id: string, newPath: string) => void
  onPreview: (file: File) => void
}

interface TableColumn {
  key: string
  label: string
  render: (fileItem: FileItem) => ReactElement
}

export const DesktopFileTable = ({
  files,
  removeFile,
  updateFilePath,
  onPreview,
}: DesktopFileTableProps) => {
  // 表格列配置
  const columns: TableColumn[] = [
    {
      key: "path",
      label: "路径",
      render: (fileItem: FileItem) => (
        <Input
          value={fileItem.path}
          onChange={(e) => updateFilePath(fileItem.id, e.target.value)}
          placeholder="/"
          className="h-8 w-full"
        />
      ),
    },
    {
      key: "name",
      label: "文件名",
      render: (fileItem: FileItem) => (
        <div
          className="truncate text-sm font-medium text-gray-900 dark:text-gray-100"
          title={fileItem.file.name}
        >
          {fileItem.file.name}
        </div>
      ),
    },
    {
      key: "preview",
      label: "类型",
      render: (fileItem: FileItem) =>
        renderFilePreview(fileItem, "medium", onPreview),
    },
    {
      key: "size",
      label: "大小",
      render: (fileItem: FileItem) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatFileSize(fileItem.file.size)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "操作",
      render: (fileItem: FileItem) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeFile(fileItem.id)}
          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="hidden overflow-x-auto rounded-md border md:block">
      <table className="w-full min-w-[600px]">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {files.map((fileItem) => (
            <tr
              key={fileItem.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-2 whitespace-nowrap">
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
