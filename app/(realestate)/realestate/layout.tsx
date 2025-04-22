"use client"

import { RealestateDashboardHeader } from "@/components/realestate/RealestateDashboardHeader"
import RealestateSidebar from "@/components/realestate/RealestateSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { useEffect, useId, useState } from "react"

export default function RealestateDashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
    const [realestates, setRealestates] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { data: session } = useSession();
    const user = session?.user; 
    const userId = session?.user?.id
 
   useEffect(() => {
    if (!userId) return;
      const fetchRealestates = async () => {
        try {
          setLoading(true)
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/companies/getCompanyByUserId/${userId}`, {
            method: 'GET',
            credentials: "include", 
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const result = await response.json();
          console.log("Realestates: ", result)
          console.log("API Response: ", result);
          
          setRealestates(result.data || []); 
          
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          console.error('Error fetching packages:', err);
        } finally {
          setLoading(false);
        }
      };
    
      fetchRealestates();
    }, [useId]);

    if(loading === true) {
      return(
        <div>Loading ....</div>
      )
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