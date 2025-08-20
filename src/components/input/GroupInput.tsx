import type { ReactNode } from "react";

interface GroupInputProps {
  children: ReactNode;
  className?: string;
}

export const GroupInput = ({ children, className = "" }: GroupInputProps) => {
  return <div className={`flex flex-col gap-2 ${className}`}>{children}</div>;
};
