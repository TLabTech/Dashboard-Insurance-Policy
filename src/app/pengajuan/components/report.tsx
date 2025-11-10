import React from "react"

import { SubmissionStatus, submissionStatusColors, submissionStatusLabels, type ListResponse } from "../types"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

import { useReactToPrint } from 'react-to-print'

import products from "@/constants/products.json"
import { useFormatDate, useFormatDigits } from "@/hooks/use-format"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Props {
  data?: ListResponse
}

export const PrintPDF = ({ data }: Props) => {
  const contentRef = React.useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      body { font-family: Arial, Helvetica; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      h1 { text-align: center; margin-bottom: 20px; font-size: 16px; }

      /* Add custom Badge styles for printing */
      .status-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        padding: 2px 8px;
        font-size: 12px;
        font-weight: 500;
        border: 1px solid #ddd;
      }

      .status-resubmitted {
        color: #f97316;
        border-color: #f97316;
      }

      .status-revision-requested {
        color: #eab308;
        border-color: #eab308;
      }

      .status-approved {
        color: #22c55e;
        border-color: #22c55e;
      }

      .status-rejected {
        color: #ef4444;
        border-color: #ef4444;
      }
    `
  })

  const getStatusClassName = (status: string) => {
    const baseClass = "status-badge"

    switch (status) {
      case SubmissionStatus.UNDER_REVIEW:
        return `${baseClass}`
      case SubmissionStatus.REVISION_REQUESTED:
        return `${baseClass} status-revision-requested`
      case SubmissionStatus.RESUBMITTED:
        return `${baseClass} status-resubmitted`
      case SubmissionStatus.APPROVED:
        return `${baseClass} status-approved`
      case SubmissionStatus.REJECTED:
        return `${baseClass} status-rejected`
      default:
        return baseClass
    }
  }

  return (
    <React.Fragment>
      <Button
        variant="outline"
        disabled={!data}
        onClick={handlePrint}
      >
        <DownloadIcon />
        <span>Unduh Laporan</span>
      </Button>
      <div className="hidden">
        <div ref={contentRef}>
          <img src="/logo-bsb.svg" alt="logo-bsb" />

          <h1>Laporan Pengajuan</h1>

          <table>
            <thead>
              <tr>
                <th>Nomor Polis</th>
                <th>Nama</th>
                <th>Produk</th>
                <th>Premi</th>
                <th>Status</th>
                <th>Pemeriksa</th>
                <th>Tanggal Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item) => {
                const formatter = useFormatDigits
                const formatDate = useFormatDate
                
                return (
                  <tr key={item.id}>
                    <td>{item.submissionNumber}</td>
                    <td>{item.policyHolderName}</td>
                    <td>{products.find((product) => product.id === item.productID)?.name}</td>
                    <td>{formatter(Number(item.annualPremium))}</td>
                    {/* <td>{item.status}</td> */}
                    {/* <td>
                      <Badge variant="outline" className={cn(submissionStatusColors[item.status], "capitalize")}>
                        {submissionStatusLabels[item.status]}
                      </Badge>
                    </td> */}
                    <td>
                      <span className={getStatusClassName(item.status)}>
                        {submissionStatusLabels[item.status]}
                      </span>
                    </td>
                    <td>{item.createdBy?.firstName + " " + item.createdBy?.lastName}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  )
}