// ไฟล์: src/app/(menu)/page.jsx (เปลี่ยนเป็น .jsx ไม่ใช่ .tsx)
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function MenuPage() {
  const [items, setItems] = useState([])
  const [cats, setCats] = useState([])
  const [selected, setSelected] = useState(null)
  const [shop, setShop] = useState({})
  const [load, setLoad] = useState(true)

  useEffect(() => {
    async function getData() {
      setLoad(true)
      
      const catRes = await supabase.from('categories').select('*').eq('is_active', true)
      const prodRes = await supabase.from('products').select('*').eq('is_available', true)
      const setRes = await supabase.from('shop_settings').select('*').single()
      
      if (catRes.data) setCats(catRes.data)
      if (prodRes.data) setItems(prodRes.data)
      if (setRes.data) setShop(setRes.data)
      
      setLoad(false)
    }
    getData()
  }, [])

  const filtered = selected ? items.filter(i => i.category_id === selected) : items

  if (load) return <div className="min-h-screen flex items-center justify-center bg-black text-white">กำลังโหลด...</div>

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-yellow-500">{shop.shop_name || 'ร้านกาแฟ'}</h1>
      
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button onClick={() => setSelected(null)} className={`px-4 py-2 rounded ${selected===null?'bg-yellow-600':'bg-gray-800'}`}>ทั้งหมด</button>
        {cats.map(c => (
          <button key={c.id} onClick={() => setSelected(c.id)} className={`px-4 py-2 rounded ${selected===c.id?'bg-yellow-600':'bg-gray-800'}`}>
            {c.name_th}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(item => (
          <div key={item.id} className="bg-gray-900 p-4 rounded-lg flex justify-between">
            <h3 className="font-bold">{item.name_th}</h3>
            <span className="text-yellow-400 font-bold">฿{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
