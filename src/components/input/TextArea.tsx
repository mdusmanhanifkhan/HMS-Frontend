type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea({ className = "", ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={`w-full min-h-[100px] p-2 rounded-md border border-gray outline-none resize-none placeholder:text-gray-100 placeholder:font-light text-sm ${className}`}
    />
  );
}
