import Header from '@/components/Header'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function MainLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // 从 user 对象获取管理员状态
  const isAdmin = user?.role === 1

  useEffect(() => {
    // 如果加载完成，且用户未登录，且访问的是受保护的路由，则重定向到登录页
    if (!loading && !user) {
      const protectedRoutes = ['/', '/records', '/users']
      if (
        protectedRoutes.some((route) => location.pathname.startsWith(route))
      ) {
        navigate('/login')
      }
    }

    // 如果用户已登录但不是管理员，且尝试访问用户管理页面，则重定向到首页
    if (!loading && user && !isAdmin && location.pathname === '/users') {
      navigate('/')
    }
  }, [user, loading, isAdmin, navigate, location.pathname])

  return (
    <div className='flex h-full flex-col'>
      <Header />
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}
