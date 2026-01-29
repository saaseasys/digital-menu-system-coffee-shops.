import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5DC]">
      <AdminHeader />
      <main className="max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  )
}