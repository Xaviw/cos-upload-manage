import {
  Image as ImageIcon,
  Video,
  Music,
  File,
  FileText,
  FileVideo,
  FileAudio,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// 定义文件项接口
export interface FileItem {
  id: string
  file: File
  path: string
  url?: string // 用于图片预览
}

// 定义上传记录接口
export interface UploadRecord {
  id: string
  version: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string | null
  status: 'approved' | 'pending' | 'rejected'
  uploadUser: string
  uploadTime: Date
  auditUser: string | null
  auditTime: Date | null
}

// 文件类型检查函数
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/')
}

export function isPDFFile(file: File): boolean {
  return file.type === 'application/pdf'
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取文件预览URL
export function getPreviewUrl(file: File): string | undefined {
  if (isImageFile(file) || isVideoFile(file) || isAudioFile(file)) {
    return URL.createObjectURL(file)
  }
  return undefined
}

// 获取文件图标
export function getFileIcon(file: File): LucideIcon {
  if (isImageFile(file)) return ImageIcon
  if (isVideoFile(file)) return Video
  if (isAudioFile(file)) return Music
  if (isPDFFile(file)) return FileText
  return File
}

// 统一的文件预览渲染函数
export function renderFilePreview(
  fileItem: FileItem,
  size: 'small' | 'medium' = 'small',
  onPreview?: (file: File) => void,
) {
  const sizeClasses = size === 'small' ? 'h-5 w-5' : 'h-6 w-6'

  if (!fileItem.url) {
    const FileIcon = getFileIcon(fileItem.file)
    return <FileIcon className={`${sizeClasses} shrink-0 text-gray-400`} />
  }

  // 创建预览触发器
  const handleClick = () => {
    if (onPreview) {
      onPreview(fileItem.file)
    }
  }

  if (isImageFile(fileItem.file)) {
    return (
      <img
        src={fileItem.url}
        alt={fileItem.file.name}
        className={`${sizeClasses} shrink-0 cursor-pointer rounded object-cover`}
        onClick={handleClick}
      />
    )
  }
  if (isVideoFile(fileItem.file)) {
    return (
      <Video
        className={`${sizeClasses} shrink-0 cursor-pointer text-blue-500`}
        onClick={handleClick}
      />
    )
  }
  if (isAudioFile(fileItem.file)) {
    return (
      <Music
        className={`${sizeClasses} shrink-0 cursor-pointer text-green-500`}
        onClick={handleClick}
      />
    )
  }
  return null
}

// 文件缩略图渲染函数
export function renderFileThumbnail(
  record: UploadRecord,
  onPreview: () => void,
) {
  if (record.fileType.startsWith('image/') && record.fileUrl) {
    return (
      <div
        className='h-10 w-10 cursor-pointer rounded object-cover'
        onClick={onPreview}
      >
        <img
          src={record.fileUrl}
          alt={record.fileName}
          className='h-full w-full rounded object-cover'
        />
      </div>
    )
  }

  if (record.fileType.startsWith('video/')) {
    return (
      <div className='flex h-10 w-10 items-center justify-center rounded bg-blue-50'>
        <FileVideo className='h-6 w-6 text-blue-500' />
      </div>
    )
  }

  if (record.fileType.startsWith('audio/')) {
    return (
      <div className='flex h-10 w-10 items-center justify-center rounded bg-green-50'>
        <FileAudio className='h-6 w-6 text-green-500' />
      </div>
    )
  }

  const FileIcon = getFileIcon({
    name: record.fileName,
    type: record.fileType,
    size: record.fileSize,
  } as File)
  return (
    <div className='flex h-10 w-10 items-center justify-center'>
      <FileIcon className='h-6 w-6 text-gray-400' />
    </div>
  )
}
