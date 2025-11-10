import React from "react"
import { toast } from "sonner"
import { Trash2Icon } from "lucide-react"
import { useNavigate } from "react-router"
import { IconDotsVertical } from "@tabler/icons-react"
import type { ColumnDef } from "@tanstack/react-table"
import { useMutation, useQueryClient } from "@tanstack/react-query"

/* components */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { DragHandle } from "@/components/data-table"

/* utils */
import { cn } from "@/lib/utils"

/* api */
import { deleteUser } from "../api"

/* constants */
import branchs from "@/constants/branchs.json"

/* types */
import type { DetailResponse } from "../types"

export const columns: ColumnDef<DetailResponse>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "userName",
    header: "Nama Pengguna",
    cell: ({ row }) => (
      <Label>{row.original.firstName} {row.original.lastName}</Label>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <Label>{row.original.email}</Label>
    ),
  },
  {
    accessorKey: "branch",
    header: "Cabang",
    cell: ({ row }) => {
      const branch = branchs.find((branch) => branch.id === row.original.branchID)

      return (
        <Label>{branch?.name || '-'}</Label>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Label className="capitalize">{row.original.role.name}</Label>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className={cn(
        row.original.isActive ? "bg-green-500" : "bg-red-500",
        "text-white")}>
        {row.original.isActive ? "Aktif" : "Non Aktif"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const [open, setOpen] = React.useState(false);
      const queryClient = useQueryClient();

      const {
        mutate,
        isPending
      } = useMutation({
        mutationKey: ['hit-delete-submission-api'],
        mutationFn: () => deleteUser(row.original.id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['list-submission'] })
          setOpen(false) // Close dialog on success
          toast.success('Pengajuan berhasil dihapus', {
            duration: 10000
          })
        }
      })

      const navigateToEdit = () => navigate(`/pengajuan/edit/${row.original.id}`)
      const navigateToDetail = () => navigate(`/pengajuan/${row.original.id}`)

      return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={navigateToDetail}>Lihat Detail</DropdownMenuItem>
          <DropdownMenuItem onClick={navigateToEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2Icon className="mr-2 size-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  submission and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  onClick={() => mutate()}
                  className="gap-2"
                >
                  {isPending && <Spinner className="size-4" />}
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    )}
  }
]