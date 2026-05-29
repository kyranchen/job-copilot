import Sidebar from '@/components/sidebar'
import Topbar from '@/components/topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#fafaf9] overflow-hidden">
      <Sidebar />
      {/* Gap between sidebar and content (single divider lives on the sidebar) */}
      <div className="w-6 shrink-0 bg-[#fafaf9]" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto relative">
          {/* Grid background — masked separately so it doesn't clip children */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(#e8e6e2 1px, transparent 1px),
                linear-gradient(90deg, #e8e6e2 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 120% 60% at 50% 0%, black 30%, transparent 80%)',
            }}
          />
          <div className="relative z-10 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
