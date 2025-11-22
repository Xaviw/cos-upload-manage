import Header from '@/components/Header'
import { Outlet } from 'react-router'

export default function MainLayout() {
  return (
    <div className='flex h-full flex-col'>
      <Header />
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}
