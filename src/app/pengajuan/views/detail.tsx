import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Approval } from "../components/approval"

/* constants */
import products from '@/constants/products.json'
import paymentFreqs from '@/constants/paymentFreqs.json'

/* api */
import { getSubmissionDetail, getSubmissionDocument } from "../api"

/* hooks */
import { useAuthStore } from "@/app/auth/store"
import { useFormatDigits } from "@/hooks/use-format"

import { cn } from "@/lib/utils"

/* types */
import  { SubmissionStatus, submissionStatusColors, submissionStatusLabels } from "../types"

export const DetailSubmissionPage = () => {
  const params = useParams();
  const id = Number(params.id);
  const formatter = useFormatDigits
  const { user } = useAuthStore();

  const {
    data,
    isFetching,
  } = useQuery({
    queryKey: ['submission-detail', id],
    queryFn: () => getSubmissionDetail(id)
  })

  const {
    data: dataDocument
  } = useQuery({
    queryKey: ['get-document', data?.id],
    queryFn: () => getSubmissionDocument(data?.id || 0),
    enabled: Boolean(data?.id)
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">
          {isFetching ? "Loading..." : data?.submissionNumber}
        </h1>

        {user?.role?.name === "supervisor" && (
          <Approval data={data} isLoading={isFetching} />
        )}
      </div>

      <Card>
        <CardContent>
          {isFetching ? (
            <div className="flex items-center justify-center w-full min-h-[200px]">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">No. Pengajuan</h4>
                <p className="text-foreground">{data?.submissionNumber}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Nama</h4>
                <p className="text-foreground">{data?.policyHolderName}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Tanggal Lahir</h4>
                <p className="text-foreground">{String(data?.policyHolderDOB) || "-"}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">NIK</h4>
                <p className="text-foreground capitalize">{data?.policyHolderNik}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Produk</h4>
                <p className="text-foreground">{products.find((product) => product.id === data?.productID)?.name}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Uang Pertanggungan</h4>
                <p className="text-foreground capitalize">{formatter(Number(data?.sumAssured))}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Premi Tahunan</h4>
                <p className="text-foreground capitalize">{formatter(Number(data?.annualPremium))}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Frekuensi Pembayaran</h4>
                <p className="text-foreground capitalize">
                  {paymentFreqs.find((p) => p.value === data?.paymentFreq)?.label || "-"}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Dokumen Pendukung</h4>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="text-sm text-primary cursor-pointer hover:underline">{data?.document}</span>
                  </DialogTrigger>
                  <DialogContent className="max-w-none! w-[90vw] h-[90vh] flex flex-col">
                    <DialogTitle>Dokumen Pendukung</DialogTitle>

                    {dataDocument?.contentType.includes('pdf') ? (
                      <iframe
                        src={dataDocument.blobURL}
                        title="Dokumen PDF"
                        className="w-full flex-1 rounded-md border"
                      />
                    ) : (
                      <img
                        src={dataDocument?.blobURL}
                        alt="Dokumen Pendukung"
                        className="w-full h-auto max-h-[80vh] object-contain rounded-md border"
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Pemeriksa</h4>
                <p className="text-foreground capitalize">{data?.createdBy?.firstName + " " + data?.createdBy?.lastName}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Status</h4>
                <Badge
                  variant="outline"
                  className={cn(submissionStatusColors[(data?.status as SubmissionStatus)], "capitalize")}
                >
                  {submissionStatusLabels[(data?.status as SubmissionStatus)]}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}