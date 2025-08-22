import { useState, useEffect, useRef } from "react";

type Option = {
  id: number | string;
  name: string;
};

type DropdownProps = {
  options: Option[];
  selected: Option | null;
  onSelect: (option: Option) => void;
  placeholder?: string;
};

export default function Dropdown({
  options,
  selected,
  onSelect,
  placeholder = "Select option...",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  // Reset highlight when options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [search, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      onSelect(filteredOptions[highlightedIndex]);
      setSearch("");
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        value={search || selected?.name || ""}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`py-1.5 w-full outline-none border-gray px-2 placeholder:text-gray-100 font-light text-sm ${
          isOpen ? "border-x border-t rounded-t-md" : "border rounded-md "
        }`}
      />

      <div
        className={`absolute top-full left-0 w-full bg-white border-x border-b border-gray rounded-b-md shadow transition-all duration-200 overflow-y-auto ${
          isOpen && filteredOptions.length > 0
            ? "max-h-40 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        {filteredOptions.map((opt, index) => (
          <p
            key={opt.id}
            className={`px-2 py-1 text-sm cursor-pointer border-b border-gray last:border-b-0 
              ${
                index === highlightedIndex
                  ? "bg-dark text-white"
                  : "hover:bg-dark hover:text-white"
              }`}
            onClick={() => {
              onSelect(opt);
              setSearch("");
              setIsOpen(false);
            }}
          >
            {opt.name}
          </p>
        ))}
      </div>
    </div>
  );
}
