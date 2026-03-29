'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  icon?: ReactNode
  description?: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  name?: string
  required?: boolean
  className?: string
}

export default function Select({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select...',
  name,
  required,
  className = '',
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue || '')

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const selected = options.find((o) => o.value === value)

  function handleSelect(optionValue: string) {
    if (controlledValue === undefined) {
      setInternalValue(optionValue)
    }
    onChange?.(optionValue)
    setOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value} required={required} />}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 border border-gray-200 rounded-xl bg-white text-left transition-all outline-none ${
          open
            ? 'ring-2 ring-brand-500 border-transparent'
            : 'hover:border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent'
        }`}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {selected ? (
            <>
              {selected.icon && <span className="flex-shrink-0 text-gray-500">{selected.icon}</span>}
              <span className="text-gray-900 truncate">{selected.label}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          {/* Backdrop — closes dropdown on outside click, no useEffect needed */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto py-1 animate-dropdown">
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${
                    isSelected ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.icon && (
                    <span className={`flex-shrink-0 ${isSelected ? 'text-brand-600' : 'text-gray-400'}`}>
                      {option.icon}
                    </span>
                  )}
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm ${isSelected ? 'font-medium' : ''}`}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="block text-xs text-gray-400">{option.description}</span>
                    )}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
