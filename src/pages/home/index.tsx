import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { UploadForm, type UploadFormProps } from "./upload-form"

const HomePage = () => {
  const handleFormSubmit: UploadFormProps["onSubmit"] = (values) => {
    // 预留后续逻辑处理位置
    console.log("处理表单提交:", values)
  }

  return (
    <div className="p-4 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>COS 文件上传管理</CardTitle>
          <CardDescription>
            上传文件到腾讯云对象存储服务，支持批量上传和路径配置
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadForm onSubmit={handleFormSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage
