import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getUserDetail } from "../api"
import { useParams } from "react-router"
import { Spinner } from "@/components/ui/spinner"


export const DetailUserPage = () => {
  const params = useParams();
  const id = Number(params.id);

  const {
    data,
    isFetching,
  } = useQuery({
    queryKey: ['user-detail', id],
    queryFn: () => getUserDetail(id)
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-3xl font-semibold">
        {isFetching ? "Loading..." : `${data?.firstName} ${data?.lastName}`}
      </h1>

      <Card>
        <CardContent>
          {isFetching ? (
            <div className="flex items-center justify-center w-full min-h-[200px]">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Nama</h4>
                <p className="text-foreground">{data?.firstName} {data?.lastName}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Email</h4>
                <p className="text-foreground">{data?.email}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Password</h4>
                <p className="text-foreground">********</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Role</h4>
                <p className="text-foreground capitalize">{data?.role?.name}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm text-muted-foreground">Status</h4>
                <p className="text-foreground">{data?.isActive ? "Aktif" : "Tidak Aktif"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}