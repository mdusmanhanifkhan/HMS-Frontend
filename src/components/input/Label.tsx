import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  props?: LabelHTMLAttributes<HTMLLabelElement>;
}

export const Label = ({ children, props }: LabelProps) => {
  return <label {...props}>{children}</label>;
};
