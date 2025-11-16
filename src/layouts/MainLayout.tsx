import Header from '@/components/Header'
import type { PropsWithChildren } from 'react'

export default function MainLayout(props: PropsWithChildren) {
  return (
    <div className='flex h-full flex-col'>
      <Header />
      <div className='flex-1'>{props.children}</div>
    </div>
  )
}
