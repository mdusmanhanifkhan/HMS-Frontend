import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = ({ className = "", ...rest }: InputProps) => {
  return (
    <input
      {...rest}
      className={`py-1.5 w-full rounded-lg outline-none border px-2 border-gray-500 ${className}`}
    />
  );
};
