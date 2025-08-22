import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: React.ReactNode;
};

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`flex items-center gap-1 bg-dark text-white text-xs rounded-lg px-2 py-1.5 border border-dark hover:bg-white hover:text-dark transition-all ease-linear duration-200 ${className || ""} cursor-pointer`}
    >
      {children}
    </button>
  );
}
