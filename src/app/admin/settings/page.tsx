'use client'

import { useState } from 'react'

export default function TestPage() {
  const [text, setText] = useState('Hello')

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Test Page</h1>
      <input 
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="bg-gray-800 text-white p-2 rounded border border-gray-600"
      />
      <p className="mt-4 text-gray-400">You typed: {text}</p>
    </div>
  )
}
