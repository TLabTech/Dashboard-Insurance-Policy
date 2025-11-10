import { useMutation, useQuery } from "@tanstack/react-query"
import { UserForm } from "../components/user-form"
import type { FormPayload } from "../types"
import { createUser, editUser, getUserDetail } from "../api"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router"

export const EditUserPage = () => {
  const params = useParams();
  const id = Number(params.id);
  const navigate = useNavigate();

  const {
    data,
    isFetching,
  } = useQuery({
    queryKey: ['user-detail', id],
    queryFn: () => getUserDetail(id)
  })

  const {
    mutate: updateUser,
    isPending: isLoadingEditUser
  } = useMutation({
    mutationKey: ['hit-edit-user-api'],
    mutationFn: (payload: FormPayload) => editUser(id, payload),
    onSuccess: () => {
      toast.success('Pengguna berhasil diubah', {
        duration: 10000
      });
      navigate('/pengguna');
    },
    onError: (error: any) => {
      const new_error = error.response?.data?.message as string[]

      new_error?.map((err) => {
        toast.error(`Pengguna gagal diubah: ${err}`);
      })
    }
  })

  const handleSubmit = (data: FormPayload) => {
    updateUser(data);
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-3xl font-semibold">Tambah Pengguna Baru</h1>

      <UserForm data={data} isLoading={isFetching || isLoadingEditUser} onSubmit={handleSubmit} />
    </div>
  )
}