import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "sonner"

/* components */
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

/* schema */
import { UpdateSchema } from "../schema"

/* api */
import { editSubmission } from "../api"

/* types */
import type { DetailResponse, FormPayload } from "../types"

interface Props {
  data?: DetailResponse
  isLoading: boolean
}

export const Approval = ({ data, isLoading }: Props) => {
  const navigate = useNavigate();

  const {
    mutate: updateSubmission,
    isPending: isLoadingEditSubmission
  } = useMutation({
    mutationKey: ['submission-approval'],
    mutationFn: (payload: FormPayload) => editSubmission(data?.id || 0, payload),
    onSuccess: () => {
      toast.success('Pengajuan berhasil disimpan', {
        duration: 10000
      });
      navigate('/pengajuan');
    },
    onError: (error: any) => {
      const new_error = error.response?.data?.message

      if (typeof new_error === 'string') {
        toast.error(`Pengajuan gagal diubah: ${new_error}`);
      } else {
        new_error?.map((err: any) => {
          toast.error(`Pengajuan gagal diubah: ${err}`);
        })
      }
    }
  })

  const form = useForm<FormPayload>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      policyHolderName: "",
      policyHolderNik: "",
      productID: "",
      sumAssured: "",
      annualPremium: "",
      paymentFreq: "",
      status: "",
      notes: "",
    }
  })

  const handleOnSubmit = (data: FormPayload, status: string) => {
    const payload = {
      ...data,
      status
    }

    updateSubmission(payload)
  }

  useEffect(() => {
    /* jika data itu ada value nya */
    if (!isLoading && data) {
      form.reset({
        policyHolderName: data?.policyHolderName,
        policyHolderNik: data?.policyHolderNik,
        policyHolderDOB: new Date(data?.policyHolderDOB),
        productID: data?.productID,
        sumAssured: data?.sumAssured,
        annualPremium: data?.annualPremium,
        paymentFreq: data?.paymentFreq,
        status: data?.status,
        notes: data?.notes,
      })
    }
  }, [data, form, isLoading])

  return (
    <div className="flex gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Revisi</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => handleOnSubmit(data, "REVISION_REQUESTED"))}>
              <DialogHeader>
                <DialogTitle>Pengajuan Revisi</DialogTitle>
                <DialogDescription>
                  Tambahkan catatan revisi agar pemohon dapat memperbaiki data sesuai kebutuhan.<br />
                  Harap berikan penjelasan yang jelas dan spesifik.
                </DialogDescription>

                <FormField
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-1 mt-4">
                      <FormLabel>Catatan</FormLabel>
                      <FormControl>
                        <Textarea
                          id="note"
                          className="w-full"
                          placeholder="Tulis catatan disini..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </DialogHeader>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" disabled={isLoading || isLoadingEditSubmission} variant="outline">Batal</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading || isLoadingEditSubmission}>Kirim</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Tolak</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => handleOnSubmit(data, "REJECTED"))}>
              <DialogHeader>
                <DialogTitle>Pengajuan Ditolak</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menolak pengajuan ini?<br />
                  Silakan tambahkan alasan penolakan agar pemohon memahami kekurangannya.
                </DialogDescription>

                <FormField
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-1 mt-4">
                      <FormLabel>Catatan</FormLabel>
                      <FormControl>
                        <Textarea
                          id="note"
                          className="w-full"
                          placeholder="Tulis catatan disini..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </DialogHeader>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" disabled={isLoading || isLoadingEditSubmission} variant="outline">Batal</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading || isLoadingEditSubmission}>Kirim</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Setujui</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => handleOnSubmit(data, "APPROVED"))}>
              <DialogHeader>
                <DialogTitle>Pengajuan Disetujui</DialogTitle>
                <DialogDescription>
                  Pengajuan ini akan disetujui dan diproses lebih lanjut.<br />
                  Pastikan seluruh data sudah benar sebelum melanjutkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" disabled={isLoading || isLoadingEditSubmission} variant="outline">Batal</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading || isLoadingEditSubmission}>Kirim</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}