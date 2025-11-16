import { NavLink } from 'react-router'
import { Badge } from '@/components/ui/badge'

export default function Header() {
  const title = import.meta.env.VITE_APP_TITLE

  return (
    <div className='flex items-center justify-between px-8 py-4 shadow-xl'>
      <h1 className='mr-auto text-xl font-semibold'>{title}</h1>

      <NavLink
        to='/'
        className='cursor-pointer hover:font-semibold hover:underline'
      >
        首页
      </NavLink>
      <NavLink
        to='/records'
        className='cursor-pointer px-8 hover:font-semibold hover:underline'
      >
        上传记录
      </NavLink>
      <NavLink
        to='/users'
        className='cursor-pointer hover:font-semibold hover:underline'
      >
        用户管理
      </NavLink>

      <span className='mr-2 ml-auto'>xavi</span>
      <Badge>管理员</Badge>
    </div>
  )
}
