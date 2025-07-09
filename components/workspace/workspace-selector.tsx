"use client"

import { Button } from "@/components/ui/button"
import { Building, ChevronDown } from "lucide-react"

export default function WorkspaceSelector() {
  return (
    <Button
      variant="outline"
      className="bg-digitalz-dark-secondary border-digitalz-border text-white hover:bg-digitalz-gray hover:border-digitalz-cyan/40"
    >
      <Building className="w-4 h-4 mr-2" />
      DigitalZ Academy
      <ChevronDown className="w-4 h-4 ml-2" />
    </Button>
  )
}
