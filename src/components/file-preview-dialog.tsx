import {
  formatFileSize,
  getPreviewUrl,
  isAudioFile,
  isImageFile,
  isVideoFile,
} from "@/utils/fileUtils"
import { Music } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FilePreviewDialogProps {
  file: File
  open: boolean
  onClose: () => void
}

export function FilePreviewDialog({
  file,
  open,
  onClose,
}: FilePreviewDialogProps) {
  const previewUrl = getPreviewUrl(file)

  const renderPreviewContent = () => {
    if (isImageFile(file)) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <img
            src={previewUrl}
            alt={file.name}
            className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-lg"
          />
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)} • {file.type}
            </p>
          </div>
        </div>
      )
    }

    if (isVideoFile(file)) {
      return (
        <div className="flex w-full flex-col items-center justify-center space-y-4">
          <video
            src={previewUrl}
            controls
            className="max-h-[60vh] max-w-full rounded-lg shadow-lg"
            preload="metadata"
          />
          <div className="w-full space-y-2 text-center">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)} • {file.type}
            </p>
          </div>
        </div>
      )
    }

    if (isAudioFile(file)) {
      return (
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-green-100 p-6 dark:bg-green-900/20">
              <Music className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2 text-center">
              <p className="w-full truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>
          </div>
          <audio
            src={previewUrl}
            controls
            className="w-full"
            preload="metadata"
          />
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-center text-gray-500">无法预览此文件类型</p>
        <p className="text-sm text-muted-foreground">{file.name}</p>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-5xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-semibold">文件预览</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-[400px] items-center justify-center p-6 pt-2">
          {renderPreviewContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
