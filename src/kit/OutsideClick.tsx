import { useRef, useEffect, ReactNode } from 'react'

export const OutsideClick = ({
  className,
  onClick,
  children,
}: {
  className?: string
  onClick: VoidFunction
  children: ReactNode
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClick()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  return (
    <div
      className={className}
      ref={ref}
    >
      {children}
    </div>
  )
}
