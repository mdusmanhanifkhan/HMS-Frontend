import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?:string;
}

export const Label = ({ children, className,required, ...rest }: LabelProps) => {
  return (
    <label
      className={`text-sm ${className ?? ""}`}
      {...rest}
    >
      {children} {required && <span className="text-red">*</span>}
    </label>
  );
};
