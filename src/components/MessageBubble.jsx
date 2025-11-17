import React from 'react'

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-md ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-white/10 text-blue-50 rounded-bl-sm border border-white/10'
        }`}
      >
        {content}
      </div>
    </div>
  )
}
