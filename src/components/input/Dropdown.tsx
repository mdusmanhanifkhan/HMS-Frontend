import { useState, useEffect, useRef } from "react";
type Option = {
  id: number | string
  name: string
}

type DropdownProps = {
  options: Option[]
  selected: Option | Option[] | null   // single or multiple
  onSelect: (option: Option) => void
  multiple?: boolean                   // NEW
  placeholder?: string
}

export default function Dropdown({
  options,
  selected,
  onSelect,
  multiple = false,
  placeholder = "Select option...",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  )

  const getDisplayValue = () => {
    if (search) return search

    if (multiple) {
      if (Array.isArray(selected) && selected.length > 0) {
        return selected.map((s) => s.name).join(", ")
      }
      return ""
    }

    return (selected as Option | null)?.name || ""
  }

  return (
    <div className="relative w-full">
      <input
        value={getDisplayValue()}
        onChange={(e) => {
          setSearch(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
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
        {filteredOptions.map((opt) => {
          const isSelected = multiple
            ? Array.isArray(selected) &&
              selected.some((s) => String(s.id) === String(opt.id))
            : (selected as Option | null)?.id === opt.id

          return (
            <p
              key={opt.id}
              className={`px-2 py-1 text-sm cursor-pointer border-b border-gray last:border-b-0 ${
                isSelected ? "bg-dark text-white" : "hover:bg-dark hover:text-white"
              }`}
              onClick={() => {
                onSelect(opt)
                setSearch("")
                setIsOpen(false);
              }}
            >
              {opt.name}
            </p>
          )
        })}
      </div>
    </div>
  )
}
