import { useMutation } from "@tanstack/react-query"
import { UserForm } from "../components/user-form"
import type { FormPayload } from "../types"
import { createUser } from "../api"
import { toast } from "sonner"
import { useNavigate } from "react-router"

export const CreateUserPage = () => {
  const navigate = useNavigate();

  const {
    mutate: createNewUser,
    isPending: isLoadingCreateNewUser
  } = useMutation({
    mutationKey: ['hit-create-user-api'],
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('Pengguna berhasil ditambahkan', {
        duration: 10000
      });
      navigate('/pengguna');
    },
    onError: (error: any) => {
      const new_error = error.response?.data?.message

      if (typeof new_error === 'string') {
        toast.error(`Pengguna gagal ditambahkan: ${new_error}`);
      } else {
        new_error?.map((err: any) => {
          toast.error(`Pengguna gagal ditambahkan: ${err}`);
        })
      }
    }
  })

  const handleSubmit = (data: FormPayload) => {
    createNewUser(data);
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-3xl font-semibold">Tambah Pengguna Baru</h1>

      <UserForm isLoading={isLoadingCreateNewUser} onSubmit={handleSubmit} />
    </div>
  )
}