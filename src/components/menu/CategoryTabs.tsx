'use client'

interface Category {
  id: number
  name_th: string
}

interface CategoryTabsProps {
  categories: Category[]
  selected: number | null
  onSelect: (id: number | null) => void
  primaryColor?: string
}

export default function CategoryTabs({ 
  categories, 
  selected, 
  onSelect, 
  primaryColor = '#D4A574' 
}: CategoryTabsProps) {
  return (
    <nav className="sticky top-[72px] z-40 bg-[#0F0F0F] border-b border-[#2C1810] overflow-x-auto scrollbar-hide shadow-lg">
      <div className="flex space-x-2 p-4 min-w-max">
        <button
          onClick={() => onSelect(null)}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
            selected === null 
              ? 'shadow-lg transform scale-105' 
              : 'hover:bg-[#252525]'
          }`}
          style={{
            backgroundColor: selected === null ? primaryColor : '#1A1A1A',
            color: selected === null ? '#0F0F0F' : '#9CA3AF',
            border: selected === null ? 'none' : '1px solid #2C1810'
          }}
        >
          ทั้งหมด
        </button>
        
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              selected === cat.id 
                ? 'shadow-lg transform scale-105' 
                : 'hover:bg-[#252525]'
            }`}
            style={{
              backgroundColor: selected === cat.id ? primaryColor : '#1A1A1A',
              color: selected === cat.id ? '#0F0F0F' : '#9CA3AF',
              border: selected === cat.id ? 'none' : '1px solid #2C1810'
            }}
          >
            {cat.name_th}
          </button>
        ))}
      </div>
    </nav>
  )
}