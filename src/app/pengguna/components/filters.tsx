import React from "react"
import { CheckIcon, ChevronsUpDownIcon, FilterIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

/* components */
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Spinner } from "@/components/ui/spinner"

/* stores */
import { useUserStore } from "../stores"

/* api */
import { getUserRoles } from "../api"

/* constants */
// import branchs from "@/constants/branchs.json"

export const Filters = () => {
  const { filters, setFilters } = useUserStore();

  const [value, setValue] = React.useState("")

  const {
    data: dataRoles,
    isFetching: isFetchingRoles
  } = useQuery({
    queryKey: ['roles'],
    queryFn: getUserRoles
  })

  const handleFilters = () => {
    setFilters({
      ...filters,
      roleID: value
    })
  }

  const resetFilters = () => {
    setFilters({
      ...filters,
      roleID: undefined
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Role</Label>
            {isFetchingRoles ? (
              <div className="flex items-center justify-center w-full min-h-[50px]">
                <Spinner />
              </div>
            ) : (
              <RadioGroup
                value={value}
                onValueChange={setValue}
              >
                {dataRoles?.data?.map((role, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(role?.id)} id={String(role?.id)} />
                    <Label htmlFor={String(role?.id)} className="capitalize">{role?.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </div>

        <SheetFooter className="flex flex-row justify-end gap-2">
          <SheetClose asChild>
            <Button variant="outline" onClick={resetFilters}>
              Atur Ulang
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button onClick={handleFilters}>
              Terapkan
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}