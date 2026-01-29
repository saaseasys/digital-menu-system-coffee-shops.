export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5DC] font-sans selection:bg-[#D4A574] selection:text-[#0F0F0F]">
      {children}
    </div>
  )
}