-- Supabase 数据库架构定义
-- 基于用户需求文档，使用最佳实践实现

-- ============================================
-- 1. 用户表 (public.users)
-- ============================================

-- 1.1 创建用户表
create table public.users (
  id uuid primary key,
  email varchar unique not null,
  name varchar not null,
  status varchar check (status in ('disabled', 'enabled')) default 'disabled',
  role varchar check (role in ('normal', 'admin')) default 'normal',
  bucket_ids uuid[] references public.buckets(id) on delete set null on update cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 1.2 启用行级安全
alter table public.users enable row level security;

-- 1.3 创建RLS策略
-- 管理员可查询全部数据
create policy "Admins can view all users" on public.users
for select
to authenticated
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  )
);

-- 管理员可修改所有数据
create policy "Admins can update all users" on public.users
for update
to authenticated
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  )
);

-- 用户只能查看自己的数据
create policy "Users can view own profile" on public.users
for select
to authenticated
using (id = auth.uid());

-- 1.4 创建更新时间戳触发器函数
create function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1.5 创建触发器：更新时自动设置updated_at
create trigger handle_users_updated_at
  before update on public.users
  for each row
  execute procedure public.handle_updated_at();

-- ============================================
-- 2. 存储桶表 (public.buckets)
-- ============================================

-- 2.1 创建存储桶表
create table public.buckets (
  id uuid primary key default gen_random_uuid(),
  bucket varchar unique not null,
  region varchar not null,
  secret_id uuid references public.secrets(id) on delete set null on update cascade,
  domain varchar not null,
  shortcuts varchar[],
  remark text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2.2 启用行级安全
alter table public.buckets enable row level security;

-- 2.3 创建RLS策略 - 所有用户可查全部数据
create policy "All authenticated users can view buckets" on public.buckets
for select
to authenticated
using (true);

-- 2.4 创建触发器：更新时自动设置updated_at
create trigger handle_buckets_updated_at
  before update on public.buckets
  for each row
  execute procedure public.handle_updated_at();

-- ============================================
-- 3. 密钥表 (public.secrets)
-- ============================================

-- 3.1 创建密钥表
create table public.secrets (
  id uuid primary key default gen_random_uuid(),
  key varchar unique not null,
  remark text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3.2 创建触发器：更新时自动设置updated_at
create trigger handle_secrets_updated_at
  before update on public.secrets
  for each row
  execute procedure public.handle_updated_at();

-- ============================================
-- 4. 文件表 (public.files)
-- ============================================

-- 4.1 创建文件表
create table public.files (
  id uuid primary key default gen_random_uuid(),
  version varchar not null,
  name varchar not null,
  path varchar not null,
  size bigint not null,
  remark text,
  status varchar check (status in ('success', 'pending', 'pass', 'refuse', 'replaced')),
  bucket_ids uuid[] references public.buckets(id) on delete restrict on update cascade,
  storage_name varchar,
  user_id uuid references public.users(id) on delete restrict on update cascade not null,
  audit_user_id uuid references public.users(id) on delete restrict on update cascade,
  audit_time timestamptz,
  audit_remark text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4.2 启用行级安全
alter table public.files enable row level security;

-- 4.3 创建RLS策略
-- 所有用户可读
create policy "All authenticated users can view files" on public.files
for select
to authenticated
using (true);

-- 管理员可修改所有数据
create policy "Admins can update all files" on public.files
for update
to authenticated
using (
  exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  )
);

-- 所有用户可新增任意数据
create policy "All authenticated users can insert files" on public.files
for insert
to authenticated
with check (true);

-- 4.4 创建文件状态更新触发器函数
create function public.handle_file_status_update()
returns trigger
language plpgsql
security definer
as $$
begin
  -- 更新updated_at
  new.updated_at = now();
  
  -- 如果状态被修改，则更新审计信息
  if old.status is distinct from new.status then
    new.audit_user_id = auth.uid();
    new.audit_time = now();
  end if;
  
  return new;
end;
$$;

-- 4.5 创建触发器：修改时更新相关字段
create trigger handle_files_updated_at
  before update on public.files
  for each row
  execute procedure public.handle_file_status_update();

-- ============================================
-- 5. 认证用户同步触发器
-- ============================================

-- 5.1 创建函数：同步用户信息到业务表
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  -- 当用户创建且已有邮箱，或用户更新且邮箱从无到有时
  if (TG_OP = 'INSERT' and new.email is not null) or 
     (TG_OP = 'UPDATE' and old.email is null and new.email is not null) then
    insert into public.users (id, email, name)
    values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', 'Unknown User'));
  end if;
  
  return new;
end;
$$;

-- 5.2 创建触发器：同步认证用户到业务表
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row
  execute procedure public.handle_new_user();

-- ============================================
-- 6. 权限设置
-- ============================================

-- 6.1 为认证用户授予必要权限
grant usage on schema public to authenticated;
grant all on public.users to authenticated;
grant select on public.buckets to authenticated;
grant select, insert, update on public.files to authenticated;

-- 6.2 为服务角色授予所有权限
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant usage on all sequences in schema public to service_role;

-- ============================================
-- 7. 索引优化
-- ============================================

-- 7.1 用户表索引
create index idx_users_name on public.users(name);
create index idx_users_email on public.users(email);
create index idx_users_status on public.users(status);
create index idx_users_role on public.users(role);

-- 7.2 文件表索引
create index idx_files_user_id on public.files(user_id);
create index idx_files_status on public.files(status);
create index idx_files_version on public.files (version);
create index idx_files_created_at on public.files(created_at);
