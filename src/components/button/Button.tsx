import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
} from "react";
import { Link } from "react-router-dom";
import type { ReactNode, ComponentPropsWithoutRef } from "react";

// ---------- VARIENT TYPES ----------
type VarientType = "default" | "outline" | "dangerBtn";

// ------- Button Props (when NOT a link) -------
type BtnProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  asLink?: false; 
  children: ReactNode;
  className?: string;
  varient?: VarientType; 
};

// ------- Link Props (when IS a link) -------
type BtnLinkProps = {
  asLink: true;
  to: string;
  children: ReactNode;
  className?: string;
  varient?: VarientType; // added
} & ComponentPropsWithoutRef<typeof Link>;

// -------- FINAL UNION TYPE --------
export type ButtonProps = BtnProps | BtnLinkProps;

export default function Button({
  children,
  className = "",
  asLink,
  varient = "default", 
  ...props
}: ButtonProps) {
  // ---------- VARIENT CLASSES ----------
  const varients: Record<VarientType, string> = {
    default: "bg-dark text-white border-dark hover:bg-white hover:text-dark",
    outline: "bg-none border-dark hover:bg-dark text-dark hover:text-white",
    dangerBtn: "bg-red-100 border-red hover:bg-white text-red-600 text-white hover:text-red-100",
  };

  if (asLink) {
    // Link button
    const { to, ...rest } = props as BtnLinkProps;

    return (
      <Link
        to={to}
        {...rest}
        className={`flex items-center group gap-2 whitespace-nowrap text-sm rounded-lg px-2 py-1.5 border transition-all duration-200 cursor-pointer ${varients[varient]} ${className}`}
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
      className={`flex items-center group gap-2 whitespace-nowrap text-sm rounded-lg px-2 py-1.5 border transition-all duration-200 cursor-pointer ${varients[varient]} ${className}`}
    >
      {children}
    </button>
  );
}
