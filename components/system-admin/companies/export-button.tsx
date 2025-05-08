"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import * as XLSX from "xlsx";
import { useCompanies } from "@/hooks/useCompanies";
import { format } from "date-fns";

export function ExportButton() {

  const {
    companies,
    total,
    isLoading,
    error,
    suspendCompany,
    isSuspending,
    activateCompany,
    isActivating,
    deactivateCompany,
    isDeactivating,
  } = useCompanies();

  const handleExport = () => {
    const data = companies.map((company) => ({
      "Company Name": company.realEstateName,
      Email: company.email,
      Phone: company.phone,
      companyStatus: company.companyStatus,
      Location: `${company.address.city}, ${company.address.region}`,
      "Listings Count": company.listingsCount,
      "Registration Date": format(new Date(company.createdAt), "MMM d, yyyy"),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Companies");
    XLSX.writeFile(wb, "companies.xlsx");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}
