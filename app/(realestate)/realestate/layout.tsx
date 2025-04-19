
import { RealestateDashboardHeader } from "@/components/realestate/RealestateDashboardHeader"
import RealestateSidebar from "@/components/realestate/RealestateSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { redirect } from "next/navigation"

export default async function RealestateDashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {

  return (
    <SidebarProvider className="container">
      <RealestateSidebar />
      <main className="w-full">
        <div className="flex items-center justify-between py-3 bg-sky-50/60">
          <SidebarTrigger className="cursor-pointer text-sky-700 font-extrabold hover:text-sky-600" />
          <RealestateDashboardHeader />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}