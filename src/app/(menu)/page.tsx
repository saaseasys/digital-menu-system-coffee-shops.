'use client'

import { useEffect, useState } from 'react'

// สร้าง supabase client ง่ายๆ ไม่ต้อง import จากไฟล์นอก
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
      
      const a = await supabase.from('categories').select('*')
      const b = await supabase.from('products').select('*')
      const c = await supabase.from('shop_settings').select('*').single()
      
      if (a.data) setCats(a.data)
      if (b.data) setItems(b.data)
      if (c.data) setShop(c.data)
      
      setLoad(false)
    }
    getData()
  }, [])

  const filtered = selected ? items.filter(i => i.category_id === selected) : items

  if (load) return <div className="min-h-screen flex items-center justify-center bg-black text-white">กำลังโหลด...</div>

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-yellow-500">{shop.shop_name || 'ร้านกาแฟ'}</h1>
      
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button onClick={() => setSelected(null)} className={`px-4 py-2 rounded ${selected===null?'bg-yellow-600':'bg-gray-800'}`}>ทั้งหมด</button>
        {cats.map(c => (
          <button key={c.id} onClick={() => setSelected(c.id)} className={`px-4 py-2 rounded whitespace-nowrap ${selected===c.id?'bg-yellow-600':'bg-gray-800'}`}>
            {c.name_th}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(item => (
          <div key={item.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{item.name_th}</h3>
              {item.description && <p className="text-gray-400 text-sm">{item.description}</p>}
            </div>
            <span className="text-yellow-400 font-bold text-xl">฿{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
