import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export const Label = ({ children, className, ...rest }: LabelProps) => {
  return (
    <label
      className={`text-sm ${className ?? ""}`}
      {...rest}
    >
      {children}
    </label>
  );
};
