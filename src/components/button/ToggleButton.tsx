import type { InputHTMLAttributes } from "react";

type ToggleButtonProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function ToggleButton({
  className = "",
  id,
  ...props
}: ToggleButtonProps) {
  return (
    <label htmlFor={id} className="inline-flex items-center cursor-pointer">
      <input
        id={id}
        type="checkbox"
        className={`sr-only peer ${className}`}
        {...props}
      />

      <div
        className="
          relative w-10 h-5 bg-gray rounded-full
          peer-focus:outline-none 
          peer-checked:bg-green
          
          after:content-[''] after:absolute after:top-[2px] after:left-[4px]
          after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
          peer-checked:after:translate-x-full
        "
      ></div>
    </label>
  );
}
