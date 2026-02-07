
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
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const optionRefs = useRef<Array<HTMLParagraphElement | null>>([])

    const filteredOptions = options.filter((opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase())
    )

const getDisplayValue = (): string => {
  // If user is typing (input is focused), always show the current search text
  if (isFocused) {
    return search
  }

  if (multiple) {
    if (Array.isArray(selected) && selected.length > 0) {
      return selected.map((s) => s.name).join(', ')
    }
    return ''
  }

  return (selected as Option | null)?.name ?? ''
}


    // 🔹 Keyboard handling
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
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
      }

      if (e.key === 'Enter' && highlightedIndex >= 0 && isOpen) {
        e.preventDefault()
        const option = filteredOptions[highlightedIndex]
        if (option) {
          onSelect(option)
          setSearch('')
          setIsOpen(false)
          setHighlightedIndex(-1)
          setIsFocused(false)
          inputRef.current?.blur()
        }
      }

      if (e.key === 'Escape') {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }

      if (e.key === 'Tab') {
        setIsOpen(false)
        setHighlightedIndex(-1)
        setIsFocused(false)
      }
    }

    // 🔹 Auto scroll highlighted option
    useEffect(() => {
      if (highlightedIndex >= 0) {
        optionRefs.current[highlightedIndex]?.scrollIntoView({
          block: 'nearest',
        })
      }
    }, [highlightedIndex])

    // 🔹 Close on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
          setHighlightedIndex(-1)
          setIsFocused(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const showActiveOutline = isOpen || isFocused

    return (
      <div ref={containerRef} className="relative w-full">
        {/* Input wrapper */}
        <div
          className={`py-1.5 px-2 flex items-center rounded-md transition-all ${
            showActiveOutline
              ? 'ring-2 ring-primary border-transparent'
              : 'border border-gray'
          }`}
        >
          <input
            ref={inputRef}
            value={getDisplayValue()}
            onChange={(e) => {
              setSearch(e.target.value)
              setIsOpen(true)
              setHighlightedIndex(0)
            }}
            onFocus={() => {
              setIsFocused(true)
              setIsOpen(true)
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full outline-none text-sm placeholder:text-gray-100 bg-transparent"
          />

          {/* Arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3 transition-transform duration-200 ${
              isOpen ? '-scale-y-100' : ''
            }`}
            viewBox="0 0 16.933 16.933"
          >
            <path d="M1.047 3.972c-.72 0-1.08.868-.571 1.376l7.408 7.408a.846.846 0 0 0 1.143 0l7.408-7.408c.783-.762-.38-1.926-1.122-1.122l-6.858 6.837L1.62 4.226a.79.79 0 0 0-.572-.254z" />
          </svg>
        </div>

        {/* Dropdown */}
        <div
          className={`absolute top-full left-0 w-full bg-white border border-gray border-t-0 rounded-b-md shadow z-10 overflow-y-auto transition-all duration-200 ${
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
                ref={(el) => {
                  optionRefs.current[index] = el
                }}
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
                  setHighlightedIndex(-1)
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
