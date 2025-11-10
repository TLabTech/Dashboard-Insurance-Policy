import { useNavigate } from "react-router"
import { Button } from "./ui/button"

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-4xl font-bold">404 - Halaman Tidak Ditemukan</h1>
      <p>Maaf, halaman yang Anda cari tidak ditemukan.</p>
      <Button onClick={() => navigate('/')}>Kembali ke Beranda</Button>
    </div>
  )
}
