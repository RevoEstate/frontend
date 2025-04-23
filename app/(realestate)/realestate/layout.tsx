"use client"

import { RealestateDashboardHeader } from "@/components/realestate/RealestateDashboardHeader"
import RealestateSidebar from "@/components/realestate/RealestateSidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useRealestateByUserId } from "@/hooks/useRealestateByUser"
import { Loader2 } from "lucide-react"

export default function RealestateDashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { 
    realestate, 
    isLoading, 
    error 
  } = useRealestateByUserId();

  if (isLoading) {
    return (
      <header className="flex items-center justify-center h-[80vh]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-transparent cursor-wait text-black"
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="flex items-center justify-between">
        <Alert variant="destructive" className="w-auto">
          <AlertDescription className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
              {error.message}
          </AlertDescription>
        </Alert>
      </header>
    );
  }

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
              <RealestateDashboardHeader realestate={realestate} error={error} isLoading={isLoading} />
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