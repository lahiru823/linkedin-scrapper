'use client'

import { useState, KeyboardEvent } from 'react'

interface TagInputProps {
  label: string
  placeholder: string
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
  colorClass: string
}

export default function TagInput({ label, placeholder, tags, onAdd, onRemove, colorClass }: TagInputProps) {
  const [input, setInput] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      onAdd(input.trim().replace(/,$/, ''))
      setInput('')
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onRemove(tags[tags.length - 1])
    }
  }

  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 p-3 border-2 border-gray-200 rounded-xl bg-white min-h-[56px] focus-within:border-blue-500 transition-colors cursor-text">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="ml-1 text-lg leading-none hover:opacity-60 focus:outline-none"
              aria-label={`Remove ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-[140px] outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add a tag</p>
    </div>
  )
}
