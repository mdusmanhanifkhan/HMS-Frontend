import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = ({ className = "", ...rest }: InputProps) => {
  return (
    <input
      {...rest}
      className={`py-1.5 w-full rounded-md outline-none border px-2 border-gray placeholder:text-gray-100 placeholder:font-light text-sm ${className}`}
    />
  );
};
