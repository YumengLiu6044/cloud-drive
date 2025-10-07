import { loginBackground } from '@/assets/assets'
import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}
export default function Container({children, className}: ContainerProps) {
  return (
    <div className={'relative w-screen h-screen p-5 ' + className}>
      <img
				src={loginBackground}
				className="absolute w-full h-full -z-10"
			></img>
      {children}
    </div>
  )
}
