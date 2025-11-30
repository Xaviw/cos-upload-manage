# Supabase-Postgres 数据库定义

## auth.users

### triggers

#### 同步用户信息到业务表

以下两种情况时执行：

- 用户刚创建，邮箱字段已有值（对应无需邮箱验证的注册方式）
- 用户更新，邮箱字段从无值变为有值（对应需要邮箱验证的注册方式）

触发后向 public.users 表插入一行，包括以下数据：

- id：同 auth 表中的用户 id
- email：同 auth 表中的用户邮箱
- name：同 auth 表中的 user_meta_data.name

## public.users

> 用户业务信息

### 字段

- id: uuid；主键；无默认值（仅通过触发器插入）
- email: varchar；唯一；非空
- name: varchar；非空
- status: varchar；可选值为 disabled、enabled；默认 disabled
- role: varchar；可选值为 normal、admin；默认 normal
- bucket_ids: uuid；数组；外键链接 buckets 表 id 字段，修改CASCADE，删除SET NULL；
- created_at: TIMESTAMPTZ；默认当前时间
- updated_at: TIMESTAMPTZ；默认值当前时间

### 触发器

#### 修改时更新 updated_at

### RLS

#### 管理员可查询全部数据

#### 管理员可修改所有数据

#### 任何人可查询自己的数据

## public.files

> 上传记录

### 字段

- id: UUID (主键)
- version: varchar (非空)
- name: varchar (非空)
- path: varchar (非空)
- size: BIGINT (非空)
- remark: TEXT
- status: varchar (可选值包括 success/pending/pass/refuse/replaced)
- bucket_ids: uuid；数组；外键链接 buckets 表 id 字段，修改CASCADE，删除RESTRICT；；
- storage_name: varchar
- user_id: UUID (关联 Users 表，修改CASCADE，删除RESTRICT；)
- audit_user_id: UUID (关联 User 表，修改CASCADE，删除RESTRICT；)
- audit_time: TIMESTAMPTZ
- audit_remark: TEXT
- created_at: TIMESTAMPTZ (默认值：NOW())
- updated_at: TIMESTAMPTZ (默认值：NOW())

### 触发器

#### 任意修改时更新 updated_at、修改status时更新audit_user_id（为操作的用户）、audit_user_time

### RLS

#### 所有用户可读

#### 管理员可修改所有数据

#### 所有用户可新增任意数据

## public.buckets

> COS 存储桶

- id: UUID (主键)
- bucket: varchar (唯一，非空)
- region: varchar (非空)
- secret_id: uuid（关联 secrets 表 id 字段，修改CASCADE，删除SET NULL；）
- domain: varchar (非空)
- shortcuts: varchar（数组）
- remark: TEXT
- created_at: TIMESTAMPTZ (默认值：NOW())
- updated_at: TIMESTAMPTZ (默认值：NOW())

### 触发器

#### 修改时更新 updated_at

### RLS

- 查（全部用户可查全部数据）

## public.secrets

> COS 密钥

- id: UUID (主键)
- key: varchar (唯一，非空)
- remark: TEXT
- created_at: TIMESTAMPTZ (默认值：NOW())
- updated_at: TIMESTAMPTZ (默认值：NOW())

### 触发器

#### 修改时更新 updated_at

### RLS

仅启用，无策略（禁止操作）
