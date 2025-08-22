import type { InputHTMLAttributes } from 'react'

type ToggleButtonProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export default function ToggleButton({
  className = '',
  ...props
}: ToggleButtonProps) {
  return (
    <div className="checkbox-apple">
      <input type="checkbox" {...props} className={className} />
      <label htmlFor="status"></label>
    </div>
  )
}
