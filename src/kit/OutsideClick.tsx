import { useRef, useEffect, ReactNode } from 'react'

function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>, onClick: VoidFunction) {
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
}

function OutsideClick({
  className,
  onClick,
  children,
}: {
  className?: string
  onClick: VoidFunction
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useOutsideAlerter(ref, onClick)

  return (
    <div
      className={className}
      ref={ref}
    >
      {children}
    </div>
  )
}

export default OutsideClick
