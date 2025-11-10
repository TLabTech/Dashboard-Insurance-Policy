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
import { useSubmissionStore } from "../stores"

/* api */
import { getUsers } from "@/app/pengguna/api"

/* utils */
import { cn } from "@/lib/utils"

/* constants */
import products from "@/constants/products.json"

/* types */
import { SubmissionStatus } from "../types"
import { useUserStore } from "@/app/pengguna/stores"

export const Filters = () => {
  const { filters: userFilters } = useUserStore();
  const { filters, setFilters } = useSubmissionStore();

  const [open, setOpen] = React.useState(false)
  const [openProduct, setOpenProduct] = React.useState(false)
  const [openUser, setOpenUser] = React.useState(false)
  const [value, setValue] = React.useState<{
    createdBy?: string;
    productID?: string;
    status?: string;
  } | undefined>(undefined)

  const {
    data: dataUsers,
    isFetching: isFetchingUsers
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getUsers({
      ...userFilters,
      limit: 100
    }),
    enabled: open
  })

  const dataUserList = React.useMemo(() => {
    return dataUsers?.data?.map((user) => {
      return {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`
      }
    })
  }, [dataUsers])

  const handleFilters = () => {
    setFilters({
      ...filters,
      createdBy: value?.createdBy,
      productID: value?.productID,
      status: value?.status !== 'all' ? value?.status : undefined
    })
  }

  const resetFilters = () => {
    setValue(undefined)
    setFilters({
      ...filters,
      createdBy: undefined,
      productID: undefined,
      status: undefined 
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
            <Label htmlFor="product">Produk</Label>
            <Popover open={openProduct} onOpenChange={setOpenProduct}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openProduct}
                  className="w-full justify-between"
                >
                  {value?.productID
                    ? products?.find((product) => String(product.id) === String(value?.productID))?.name
                    : "Pilih produk..."}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] p-0">
                <Command>
                  <CommandInput placeholder="Cari produk disini ..." />
                  <CommandList>
                    <CommandEmpty>Pemeriksa tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {products?.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={product.name}
                          className="cursor-pointer"
                          onSelect={(currentValue) => {
                            setValue((value) => {
                              return {
                                ...value,
                                productID: currentValue === product.name
                                  ? String(product.id)
                                  : undefined
                              }
                            })
                            setOpenProduct(false)
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === String(product.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {product.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="user">Pemeriksa</Label>
            <Popover open={openUser} onOpenChange={setOpenUser}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openUser}
                  disabled={isFetchingUsers}
                  className="w-full justify-between"
                >
                  {value?.createdBy
                    ? dataUserList?.find((user) => String(user.id) === String(value?.createdBy))?.fullName
                    : "Pilih pemeriksa..."}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] p-0">
                <Command>
                  <CommandInput placeholder="Cari pemeriksa disini ..." />
                  <CommandList>
                    <CommandEmpty>Pemeriksa tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {dataUserList?.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.fullName}
                          className="cursor-pointer"
                          onSelect={(currentValue) => {
                            setValue((value) => {
                              return {
                                ...value,
                                createdBy: currentValue === user.fullName
                                  ? String(user.id)
                                  : undefined
                              }
                            })
                            setOpenUser(false)
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === String(user.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {user.fullName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="status">Status</Label>
            
              <RadioGroup
                defaultValue="all"
                value={value?.status}
                onValueChange={(radioValue) => {
                  setValue((value) => {
                    return {
                      ...value,
                      status: radioValue
                    }
                  })
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" />
                  <Label htmlFor="all">Semua</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SubmissionStatus.UNDER_REVIEW} id={SubmissionStatus.UNDER_REVIEW} />
                  <Label htmlFor={SubmissionStatus.UNDER_REVIEW}>Diajukan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SubmissionStatus.RESUBMITTED} id={SubmissionStatus.RESUBMITTED} />
                  <Label htmlFor={SubmissionStatus.RESUBMITTED}>Diajukan Ulang</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SubmissionStatus.REVISION_REQUESTED} id={SubmissionStatus.REVISION_REQUESTED} />
                  <Label htmlFor={SubmissionStatus.REVISION_REQUESTED}>Revisi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SubmissionStatus.APPROVED} id={SubmissionStatus.APPROVED} />
                  <Label htmlFor={SubmissionStatus.APPROVED}>Disetujui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SubmissionStatus.REJECTED} id={SubmissionStatus.REJECTED} />
                  <Label htmlFor={SubmissionStatus.REJECTED}>Ditolak</Label>
                </div>
              </RadioGroup>
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