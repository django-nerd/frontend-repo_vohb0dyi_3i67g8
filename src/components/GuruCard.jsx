import React from 'react'

export default function GuruCard({ guru, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(guru)}
      className={`group w-full text-left p-4 rounded-xl border transition-all backdrop-blur-sm shadow-sm ${
        selected ? 'border-blue-400/60 bg-blue-400/10' : 'border-white/10 hover:border-white/20 bg-white/5'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">
          {guru.avatar || '🪷'}
        </div>
        <div>
          <div className="font-semibold text-white">{guru.name}</div>
          <div className="text-xs text-blue-200/70">{guru.description || guru.archetype}</div>
        </div>
      </div>
    </button>
  )
}
