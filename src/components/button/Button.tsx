import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
} from "react";
import { Link } from "react-router-dom";
import type { ReactNode, ComponentPropsWithoutRef } from "react";

// ------- Button Props (when NOT a link) -------
type BtnProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  asLink?: false; // explicit
  children: ReactNode;
  className?: string;
};

// ------- Link Props (when IS a link) -------
type BtnLinkProps = {
  asLink: true;
  to: string;
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<typeof Link>;

// -------- FINAL UNION TYPE --------
export type ButtonProps = BtnProps | BtnLinkProps;

export default function Button({
  children,
  className = "",
  asLink,
  ...props
}: ButtonProps) {
  if (asLink) {
    // Link button
    const { to, ...rest } = props as BtnLinkProps;

    return (
      <Link
        to={to}
        {...rest}
        className={`flex items-center group gap-2 bg-dark text-white whitespace-nowrap text-sm rounded-lg px-2 py-1.5 border border-dark hover:bg-white hover:text-dark transition-all duration-200 cursor-pointer ${className}`}
      >
        {children}
      </Link>
    );
  }

  // Normal button
  const buttonProps = props as BtnProps;

  return (
    <button
      {...buttonProps}
      className={`flex items-center group gap-2 bg-dark text-white whitespace-nowrap text-sm rounded-lg px-2 py-1.5 border border-dark hover:bg-white hover:text-dark transition-all duration-200 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
