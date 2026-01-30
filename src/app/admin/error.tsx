'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-6 max-w-2xl w-full">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-400 mb-2 text-center">เกิดข้อผิดพลาด</h2>
        <p className="text-gray-400 mb-4 text-center">{error.message}</p>
        
        {error.stack && (
          <div className="bg-black/50 p-4 rounded-lg overflow-auto max-h-64 text-xs font-mono text-red-300 mb-4">
            <pre>{error.stack}</pre>
          </div>
        )}
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-[#D4A574] text-[#0F0F0F] rounded-lg font-bold"
          >
            ลองใหม่
          </button>
          <a
            href="/admin/login"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            ไปหน้า Login
          </a>
        </div>
      </div>
    </div>
  )
}
