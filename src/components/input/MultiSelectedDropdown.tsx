import { useState, useEffect, useRef } from 'react'

type Option = {
  id: number | string
  name: string
}

type MultiDropdownProps = {
  options: Option[]
  selected: Option[]
  onSelect: (option: Option) => void
  onRemove: (option: Option) => void
  placeholder?: string
}

const MultiSelectedDropdown = ({
  options,
  selected,
  onSelect,
  onRemove,
  placeholder = 'Select options...',
}: MultiDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(
    (opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some((s) => String(s.id) === String(opt.id))
  )

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
      const option = filteredOptions[highlightedIndex]
      if (option) {
        onSelect(option)
        setSearch('')
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div
        className={`py-1.5 w-full outline-none border-gray px-2 flex items-center border rounded-md`}
      >
        <input
          value={search}
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
        >
          <path d="M1.047 3.972c-.72 0-1.08.868-.571 1.376l7.408 7.408a.846.846 0 0 0 1.143 0l7.408-7.408c.783-.762-.38-1.926-1.122-1.122l-6.858 6.837L1.62 4.226a.79.79 0 0 0-.572-.254z"></path>
        </svg>
      </div>

      {/* Dropdown options */}
      <div
        className={`absolute top-8 left-0 w-full bg-white border-x border-b border-gray rounded-b-md shadow transition-all duration-200 overflow-y-auto z-10 ${
          isOpen && filteredOptions.length > 0
            ? 'max-h-40 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        {filteredOptions.map((opt, index) => (
          <p
            key={opt.id}
            className={`px-2 py-1 text-sm cursor-pointer border-b border-gray last:border-b-0 ${
              index === highlightedIndex
                ? 'bg-dark text-white'
                : 'hover:bg-dark hover:text-white'
            }`}
            onClick={() => {
              onSelect(opt)
              setSearch('')
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
          >
            {opt.name}
          </p>
        ))}
      </div>

      {/* Selected items */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1 bg-dark text-sm px-2 py-[2px] rounded-full text-white cursor-pointer"
            >
              {s.name}
              <button
                type="button"
                onClick={() => onRemove(s)}
                className="ml-1 text-white hover:text-red font-bold cursor-pointer text-[16px]" 
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiSelectedDropdown
