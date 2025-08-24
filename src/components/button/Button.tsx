import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { Link } from "react-router-dom";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: React.ReactNode;
  asLink?: boolean;
  to?: string;
};

export default function Button({
  children,
  className = "",
  asLink = false,
  to = "/",
  ...props
}: ButtonProps) {
  const ElemType: any = asLink ? Link : "button";

  return (
    <ElemType
      {...(asLink ? { to } : props)}
      className={`flex items-center gap-1 bg-dark text-white text-xs rounded-lg px-2 py-1.5 border border-dark hover:bg-white hover:text-dark transition-all ease-linear duration-200 cursor-pointer ${className}`}
    >
      {children}
    </ElemType>
  );
}
