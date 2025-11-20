"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export function ComboboxDemo({ statuts, setSelectedStatus }: {
  statuts: { value: string, label: string }[],
  setSelectedStatus: (v: string | null) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
  <div
    className="border border-[#E5E7EB] flex items-center gap-2 px-8 rounded-xl h-16 cursor-pointer bg-white"
    aria-expanded={open}
    aria-controls=""
    role="combobox"
    onClick={() => setOpen(!open)}
  >
    <span className="w-full text-left text-[#6B7280]">
      {value
        ? statuts.find((statut) => statut.value === value)?.label
        : "Statut"}
    </span>

    <ChevronsUpDown className="opacity-50" />
  </div>
</PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un statut" className="h-9" />
          <CommandList>
            <CommandEmpty>Aucun statut trouvé</CommandEmpty>
            <CommandGroup>
              {statuts.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setSelectedStatus(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
