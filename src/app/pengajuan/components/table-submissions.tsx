import React from "react"
import { useQuery } from "@tanstack/react-query"

/* components */
import { DataTable } from "@/components/data-table"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Filters } from "../components/filters"
import { columns } from "./columns"

/* api */
import { getSubmission } from "../api"

/* stores */
import { useSubmissionStore } from "../stores"

/* hooks */
import { useDebounce } from "@/hooks/use-debounce"

/* types */
import type { ListResponse } from "../types"

export const TableSubmissions = () => {
  const { filters, setFilters } = useSubmissionStore();

  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search)

  const {
    data,
    isFetching
  } = useQuery({
    queryKey: ['list-submission', filters, debouncedSearch],
    queryFn: () => getSubmission({
      ...filters,
      search: debouncedSearch
    }),
  })

  const handlePaginationChange = (data: number) => {
    setFilters({
      ...filters,
      page: data
    })
  }

  return (
    <DataTable
      columns={columns}
      isLoading={isFetching}
      data={data?.data as ListResponse}
      pagination={{
        total_data: data?.total_data as number,
        total_page: data?.total_page as number,
        current_page: data?.current_page as number,
        limit: data?.limit as number
      }}
      onPaginationChange={handlePaginationChange}
      headers={() => (
        <div className="flex justify-between">
          <div className="relative w-full max-w-[400px]">
            <Input
              value={search}
              disabled={isFetching}
              placeholder="Cari Nama atau Nomor Polis disini..."
              onChange={(e) => setSearch(e.target.value)}
            />

            {isFetching && <Spinner className="absolute top-2.5 right-2.5" />}
          </div>
  
          <Filters />
        </div>
      )}
    />
  )
}
