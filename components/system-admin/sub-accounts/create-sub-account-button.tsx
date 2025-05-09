"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CreateSubAccountDialog } from "@/components/system-admin/sub-accounts/create-sub-account-dialog"

export function CreateSubAccountButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      {/* <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Sub-Account
      </Button> */}
      <CreateSubAccountDialog />
    </>
  )
}
