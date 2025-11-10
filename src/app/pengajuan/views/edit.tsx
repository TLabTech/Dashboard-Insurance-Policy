import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router"

/* components */
import { SubmissionForm } from "../components/submission-form"

/* api */
import { editSubmission, getSubmissionDetail } from "../api"

/* types */
import type { FormPayload } from "../types"

export const EditSubmissionPage = () => {
  const params = useParams();
  const id = Number(params.id);
  const navigate = useNavigate();

  const {
    data,
    isFetching,
  } = useQuery({
    queryKey: ['submission-detail', id],
    queryFn: () => getSubmissionDetail(id)
  })

  const {
    mutate: updateSubmission,
    isPending: isLoadingEditSubmission
  } = useMutation({
    mutationKey: ['hit-edit-submission-api'],
    mutationFn: (payload: FormPayload) => editSubmission(id, payload),
    onSuccess: () => {
      toast.success('Pengajuan berhasil ditambahkan', {
        duration: 10000
      });
      navigate('/pengajuan');
    },
    onError: (error: any) => {
      const new_error = error.response?.data?.message

      if (typeof new_error === 'string') {
        toast.error(`Pengajuan gagal ditambahkan: ${new_error}`);
      } else {
        new_error?.map((err: any) => {
          toast.error(`Pengajuan gagal ditambahkan: ${err}`);
        })
      }
    }
  })

  const handleSubmit = (data: FormPayload) => {
    updateSubmission(data);
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-3xl font-semibold">Ubah Pengajuan</h1>

      <SubmissionForm data={data} isLoading={isFetching || isLoadingEditSubmission} onSubmit={handleSubmit} />
    </div>
  )
}