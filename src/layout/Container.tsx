import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={`p-4 ${className ?? ""}`}>{children}</div>;
};

export default Container;
