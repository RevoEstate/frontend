import { RealestateDashboardHeader } from "@/components/realestate/RealestateDashboardHeader"
import RealestateSidebar from "@/components/realestate/RealestateSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default async function RealestateDashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <SidebarProvider>
      <div className="flex md:w-screen">
          <RealestateSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col w-sm md:max-w-7xl md:w-4xl">
          <header className="sticky top-0 z-10 bg-gray-50 ">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="cursor-pointer text-sky-700 font-extrabold hover:text-sky-600" />
              </div>
              <RealestateDashboardHeader />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}