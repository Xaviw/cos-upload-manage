## User

- id: UUID (主键)
- email: TEXT (唯一，非空)
- name: TEXT
- status: SMALLINT (0：禁用；1：启用，默认值：1)
- role: SMALLINT (0：普通用户；1：管理员，默认值：0)
- bucket_ids: JSONB (存储桶 id 数组，默认值：'[]')
- created_at: TIMESTAMPTZ (默认值：NOW())
- updated_at: TIMESTAMPTZ (默认值：NOW())

### User RLS

- 查（管理员可查全部数据）
- 改状态（管理员可改非管理员的 status 字段）
- 新增：改状态（管理员可改全部用户的 bucket_ids 字段）

## File

- id: UUID (主键)
- version: TEXT (非空)
- name: TEXT (非空)
- path: TEXT (非空)
- size: BIGINT (bytes数字，非空)
- remark: TEXT
- status: TEXT (success/pending/pass/refuse/replaced)
- bucket_ids: JSONB (存储桶 id 数组，默认值：'[]')
- storage_name: TEXT
- user_id: UUID (关联 User 表，非空)
- audit_user_id: UUID (关联 User 表)
- audit_time: TIMESTAMPTZ
- audit_remark: TEXT
- created_at: TIMESTAMPTZ (默认值：NOW())
- updated_at: TIMESTAMPTZ (默认值：NOW())

### File RLS

- 增（全部用户）
- 查（全部用户）
- 审核（管理员改未审核数据的 status 字段）

## Bucket

> Bucket 表支持查询操作，启用 RLS

- id: UUID (主键)
- bucket: TEXT (唯一，非空)
- region: TEXT (非空)
- secret: TEXT (非空)
- url: TEXT (非空)
- shortcuts: JSONB (快捷路径数组，默认值：'[]')
- remark: TEXT
- created_at: TIMESTAMPTZ (默认值：NOW())
- updated_at: TIMESTAMPTZ (默认值：NOW())

### Bucket RLS

- 查（全部用户可查全部数据）

## Supabase 实施步骤

### 1. 创建表结构

1. 创建 Users 表 ✅
2. 创建 Files 表 ✅
3. 创建 Bucket 表 ✅
4. 添加索引 ✅
5. 创建更新时间触发器 ✅

### 2. 配置 RLS 策略

1. 为 Users 和 Files 表启用 RLS ✅
2. 创建 Users 表的 RLS 策略 ✅
   - "管理员可以查看所有用户数据"
   - "管理员可以修改非管理员用户的状态"
3. 创建 Files 表的 RLS 策略 ✅
   - "所有用户可以创建文件"
   - "所有用户可以查看所有文件"
   - "管理员可以审核文件"

### 3. 验证配置

1. 检查表结构 ✅
2. 检查 RLS 策略 ✅
3. 测试基本功能 待完成

## 迁移记录

1. create_users_table (20251123052712)
2. create_files_table (20251123052745)
3. create_bucket_table (20251123052753)
4. create_update_trigger_function (20251123052804)
5. enable_rls_and_create_policies_fixed (20251123052830)
6. add_user_bucket_ids_update_policy (20251123053814)
7. enable_bucket_rls_and_add_policy (20251123053821)
8. update_bucket_rls_policy_for_all_users (20251123053907)
