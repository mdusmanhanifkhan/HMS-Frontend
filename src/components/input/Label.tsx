import type { LabelHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?:string;
  link?:string
}

export const Label = ({ children, className,required , link, ...rest }: LabelProps) => {
  return (
    <label
      className={`text-sm ${className ?? ""}`}
      {...rest}
    >
      {children} {required && <span className="text-red">*</span>} {link && <Link to={link} target="_blank" className="bg-dark text-white rounded-full ms-2 px-1 pb-0.5" >+</Link>}
    </label>
  );
};
