import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useNavigate } from "react-router"

import { SubmissionForm } from "../components/submission-form"

import { createSubmission } from "../api"

import type { FormPayload } from "../types"

export const CreateSubmissionPage = () => {
  const navigate = useNavigate();

  const {
    mutate: createNewSubmission,
    isPending: isLoadingCreateNewSubmission
  } = useMutation({
    mutationKey: ['hit-create-submission-api'],
    mutationFn: createSubmission,
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
    createNewSubmission(data);
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-3xl font-semibold">Tambah Pengajuan Baru</h1>

      <SubmissionForm isLoading={isLoadingCreateNewSubmission} onSubmit={handleSubmit} />
    </div>
  )
}