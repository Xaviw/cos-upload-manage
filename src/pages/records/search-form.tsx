import { format } from "date-fns"
import { RotateCcw, Search } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MultiSelect } from "@/components/multi-select"

import {
  STATUS_OPTIONS,
  VERSION_OPTIONS,
  type SearchFormValues,
} from "./config"

interface SearchFormProps {
  onSearch: (filters: SearchFormValues) => void
  onReset: () => void
}

export function SearchForm({ onSearch, onReset }: SearchFormProps) {
  const form = useForm<SearchFormValues>({
    defaultValues: {
      version: "",
      user: "",
      statuses: [],
      dateRange: {},
    },
  })

  // 处理搜索
  const handleSearch = (values: SearchFormValues) => {
    onSearch(values)
  }

  // 处理重置
  const handleReset = () => {
    form.reset()
    onReset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSearch)}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {/* 版本号筛选 */}
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>版本号</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择版本号" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {VERSION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* 上传用户筛选 */}
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>上传用户</FormLabel>
              <FormControl>
                <Input placeholder="请输入上传用户名" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 状态筛选 */}
        <FormField
          control={form.control}
          name="statuses"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>状态</FormLabel>
              <FormControl>
                <MultiSelect
                  options={STATUS_OPTIONS}
                  selectedValues={field.value || []}
                  onChange={field.onChange}
                  placeholder="请选择状态"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 上传时间筛选 */}
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>上传时间</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {field.value.from && field.value.to
                        ? `${format(field.value.from, "yyyy-MM-dd")} - ${format(
                            field.value.to,
                            "yyyy-MM-dd"
                          )}`
                        : field.value.from
                          ? format(field.value.from, "yyyy-MM-dd")
                          : "请选择"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: field.value.from,
                      to: field.value.to,
                    }}
                    onSelect={(range) =>
                      field.onChange({
                        from: range?.from,
                        to: range?.to,
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        {/* 操作按钮 */}
        <div className="flex items-end space-x-2">
          <Button type="submit" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            搜索
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
        </div>
      </form>
    </Form>
  )
}
