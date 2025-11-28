import { useState } from "react"
import { type UploadRecord } from "@/utils/fileUtils"
import { type VisibilityState } from "@tanstack/react-table"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { type SearchFormValues } from "./config"
import { RecordsTable } from "./records-table"
import { SearchForm } from "./search-form"

export default function UploadRecords() {
  const [data, setData] = useState<UploadRecord[]>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  console.log("setData 可用于更新表格数据:", setData)

  // 重置筛选器
  const resetFilters = () => {}

  // 处理审核操作
  const handleAudit = (recordId: string, action: "approve" | "reject") => {
    console.log("审核操作:", recordId, action)
  }

  // 处理搜索
  const handleSearch = (filters: SearchFormValues) => {
    console.log("搜索条件:", filters)
  }

  return (
    <Card className="m-4 lg:m-8">
      <CardHeader>
        <CardTitle>上传记录</CardTitle>
        <CardDescription>管理和审核所有上传的文件记录</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 筛选器部分 */}
        <SearchForm onSearch={handleSearch} onReset={resetFilters} />

        <Separator />

        {/* 表格部分 */}
        <RecordsTable
          data={data}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          onAudit={handleAudit}
        />
      </CardContent>
    </Card>
  )
}
