import type { InputHTMLAttributes } from 'react'

type variant = 'input' | 'type_time';
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  variant?: variant
}

export const Input = ({
  className = '',
  variant = 'input',
  ...rest
}: InputProps) => {
  const variants: Record<variant, string> = {
    input:'py-1.5 w-full rounded-md outline-none border px-2 border-gray placeholder:text-gray-100 placeholder:font-light',
    type_time:"bg-gray-50 border leading-none border-gray text-dark text-xs rounded-md block w-full px-2.5 py-[10px]"
  }
  return (
    <input {...rest} className={` text-sm ${variants[variant]} ${className}`} />
  )
}
