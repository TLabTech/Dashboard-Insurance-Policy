import { useNavigate } from "react-router"
import { PlusIcon } from "lucide-react"

/* components */
import { Button } from "@/components/ui/button"
import { TableSubmissions } from "../components/table-submissions"

export const ListSubmissionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Pengajuan</h1>

        <Button
          onClick={() => navigate('/pengajuan/create')}
        >
          <PlusIcon />
          Tambah Pengajuan
        </Button>
      </div>

      <TableSubmissions />
    </div>
  )
}