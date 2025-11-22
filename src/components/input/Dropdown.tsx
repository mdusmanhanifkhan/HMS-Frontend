import { useState, useEffect, useRef } from 'react'

type Option = {
  id: number | string
  name: string
}

type DropdownProps = {
  options: Option[]
  selected: Option | Option[] | null
  onSelect: (option: Option) => void
  multiple?: boolean
  placeholder?: string
}

export default function Dropdown({
  options,
  selected,
  onSelect,
  multiple = false,
  placeholder = 'Select option...',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  )

  const getDisplayValue = () => {
    if (search) return search
    if (multiple) {
      if (Array.isArray(selected) && selected.length > 0) {
        return selected.map((s) => s.name).join(', ')
      }
      return ''
    }
    return (selected as Option | null)?.name || ''
  }

  // ✅ Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true)
      setHighlightedIndex(0)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      )
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && isOpen) {
      e.preventDefault()
      const selectedOption = filteredOptions[highlightedIndex]
      if (selectedOption) {
        onSelect(selectedOption)
        setSearch('')
        setIsOpen(false)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  // ✅ Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`py-1.5 w-full outline-none border-gray px-2  flex items-center ${
          isOpen ? 'border-x border-t rounded-t-md' : 'border rounded-md'
        }`}
      >
        <input
          value={getDisplayValue()}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
            setHighlightedIndex(0)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full outline-none placeholder:text-gray-100 font-light text-sm"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${isOpen ? '-scale-y-100' : ''} w-3 transition-all ease-linear duration-200`}
          viewBox="0 0 16.933 16.933"
          id="down-arrow"
        >
          <path d="M1.047 3.972c-.72 0-1.08.868-.571 1.376l7.408 7.408a.846.846 0 0 0 1.143 0l7.408-7.408c.783-.762-.38-1.926-1.122-1.122l-6.858 6.837L1.62 4.226a.79.79 0 0 0-.572-.254z"></path>
        </svg>
      </div>

      <div
        className={`absolute top-full left-0 w-full bg-white border-x border-b border-gray rounded-b-md shadow transition-all duration-200 overflow-y-auto z-10 ${
          isOpen && filteredOptions.length > 0
            ? 'max-h-40 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        {filteredOptions.map((opt, index) => {
          const isSelected = multiple
            ? Array.isArray(selected) &&
              selected.some((s) => String(s.id) === String(opt.id))
            : (selected as Option | null)?.id === opt.id

          const isHighlighted = index === highlightedIndex

          return (
            <p
              key={opt.id}
              className={`px-2 py-1 text-sm cursor-pointer border-b border-gray last:border-b-0 ${
                isHighlighted
                  ? 'bg-dark text-white'
                  : isSelected
                    ? 'bg-gray-200'
                    : 'hover:bg-dark hover:text-white'
              }`}
              onClick={() => {
                onSelect(opt)
                setSearch('')
                setIsOpen(false)
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {opt.name}
            </p>
          )
        })}
      </div>
    </div>
  )
}
