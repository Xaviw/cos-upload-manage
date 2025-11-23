import { useState } from 'react'
import { NavLink } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from './ui/sheet'
import { Menu, Home, FileText, Users, Key, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const title = import.meta.env.VITE_APP_TITLE
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  // 从 user 对象获取管理员状态和用户信息
  const isAdmin = user?.role === 1
  const userData = user

  const navItems = [
    { to: '/', label: '首页', icon: Home },
    { to: '/records', label: '上传记录', icon: FileText },
    // 只有管理员才能看到用户管理菜单
    ...(isAdmin ? [{ to: '/users', label: '用户管理', icon: Users }] : []),
  ]

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      window.location.href = '/login'
    } else {
      console.error('退出登录失败:', result.error)
    }
  }

  const MobileMenu = () => (
    <div className='flex flex-col gap-4 p-4'>
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon className='h-4 w-4' />
            {item.label}
          </NavLink>
        )
      })}
      <div className='mt-4 border-t pt-4'>
        <Button
          variant='ghost'
          className='w-full justify-start gap-3'
          onClick={() => (window.location.href = '/change-password')}
        >
          修改密码
        </Button>
        <Button
          variant='ghost'
          className='w-full justify-start gap-3'
          onClick={handleSignOut}
        >
          退出登录
        </Button>
      </div>
    </div>
  )

  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
      <div className='flex h-16 w-full items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16'>
        {/* Logo/Title */}
        <div className='flex items-center gap-2'>
          <NavLink
            to='/'
            className='flex items-center gap-2 transition-opacity hover:opacity-80'
          >
            <h1 className='text-foreground text-xl font-bold'>{title}</h1>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className='hidden items-center gap-1 md:flex'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              {({ isActive }) => (
                <div className='flex items-center gap-2'>
                  <item.icon className='h-4 w-4' />
                  {item.label}
                  {isActive && (
                    <div className='bg-primary/10 absolute inset-0 -z-10 rounded-md' />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right side controls */}
        <div className='flex items-center gap-2'>
          <ModeToggle />

          {/* User Info - Desktop only */}
          <div className='hidden items-center md:flex'>
            <HoverCard
              openDelay={150}
              closeDelay={100}
            >
              <HoverCardTrigger asChild>
                <div className='group hover:bg-accent/80 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200'>
                  <div className='hidden sm:block'>
                    <span className='group-hover:text-primary text-sm font-medium'>
                      {userData?.name || user?.email?.split('@')[0] || '用户'}
                    </span>
                  </div>
                  {isAdmin && (
                    <Badge
                      variant='secondary'
                      className='bg-primary/10 text-primary hover:bg-primary/20 text-xs transition-colors'
                    >
                      管理员
                    </Badge>
                  )}
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                className='w-48 border p-2 shadow-lg'
                align='end'
              >
                <div className='space-y-1'>
                  <div className='border-b px-3 py-2'>
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-2 rounded-full bg-green-500' />
                      <p className='text-sm font-medium'>
                        {userData?.name || user?.email?.split('@')[0] || '用户'}
                      </p>
                    </div>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {user?.email || ''}
                    </p>
                  </div>
                  <div className='py-1'>
                    <Button
                      variant='ghost'
                      className='hover:bg-accent/50 h-auto w-full justify-start gap-2 px-3 py-2'
                      onClick={() =>
                        (window.location.href = '/change-password')
                      }
                    >
                      <Key className='h-4 w-4' />
                      <span className='text-sm'>修改密码</span>
                    </Button>
                    <Button
                      variant='ghost'
                      className='text-destructive hover:bg-destructive/5 hover:text-destructive h-auto w-full justify-start gap-2 px-3 py-2'
                      onClick={handleSignOut}
                    >
                      <LogOut className='h-4 w-4' />
                      <span className='text-sm'>退出登录</span>
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Mobile menu button */}
          <Sheet
            open={isMobileMenuOpen}
            onOpenChange={setIsMobileMenuOpen}
          >
            <SheetTrigger
              asChild
              className='md:hidden'
            >
              <Button
                variant='ghost'
                size='icon'
              >
                <Menu className='h-5 w-5' />
                <span className='sr-only'>打开菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='w-[300px] sm:w-[350px]'
            >
              <SheetHeader>
                <div className='flex items-center gap-2 pb-4'>
                  <h2 className='text-lg font-semibold'>菜单</h2>
                </div>
              </SheetHeader>
              <MobileMenu />
              <div className='mt-auto border-t pt-4'>
                <div className='flex items-center gap-3 px-3 py-2'>
                  <div>
                    <p className='text-sm font-medium'>
                      {userData?.name || user?.email?.split('@')[0] || '用户'}
                    </p>
                    {isAdmin && (
                      <p className='text-muted-foreground text-xs'>管理员</p>
                    )}
                    <p className='text-muted-foreground mt-1 text-xs'>
                      {user?.email || ''}
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
