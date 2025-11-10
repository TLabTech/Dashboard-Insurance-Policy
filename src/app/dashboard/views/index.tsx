import { useQuery } from "@tanstack/react-query"

/* components */
import { SectionCards } from "@/components/section-cards"
import { TableSubmissions } from "@/app/pengajuan/components/table-submissions"

/* api */
import { getSubmissionSummary } from "@/app/pengajuan/api"

export const DashboardPage = () => {
  const {
    data: dataSummary,
  } = useQuery({
    queryKey: ['list-submission-summary'],
    queryFn: getSubmissionSummary,
  })

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards data={dataSummary} />

      <div className="space-y-4 px-4">
        <div className="space-y-2 px-4">
          <h1 className="text-xl font-semibold">Pengajuan Terbaru</h1>
          <p className="text-sm text-muted-foreground">Lihat pengajuan terbaru yang sudah masuk ke sistem</p>
        </div>

        <TableSubmissions />
      </div>
    </div>
  )
}
