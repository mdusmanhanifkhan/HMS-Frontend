import type { InputHTMLAttributes } from 'react'

type Variant = 'input' | 'type_time' | 'none'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  variant?: Variant
}

export const Input = ({
  className = '',
  variant = 'input',
  ...rest
}: InputProps) => {
  const variants: Record<Variant, string> = {
    input:
      'py-1.5 w-full rounded-md border px-2 border-gray ' +
      'placeholder:text-gray-100 placeholder:font-light ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent',

    type_time:
      'bg-gray-50 border leading-none border-gray text-dark text-xs rounded-md ' +
      'block w-full px-2.5 py-[7px] ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent',

    none: '',
  }

  return (
    <input
      {...rest}
      className={`text-sm transition-all ${variants[variant]} ${className}`}
    />
  )
}
