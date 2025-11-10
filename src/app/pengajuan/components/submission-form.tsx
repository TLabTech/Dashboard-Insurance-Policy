import { useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"

/* icons */
import { CalendarRangeIcon } from "lucide-react"

/* components */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { InputNumber } from "@/components/ui/input-number"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectItem, SelectContent, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select"

/* schema */
import { CreateSchema, UpdateSchema } from "../schema"

/* constants */
import products from "@/constants/products.json"
import paymentFreqs from "@/constants/paymentFreqs.json"

/* api */
import { getSubmissionDocument } from "../api"

/* types */
import type { DetailResponse, FormPayload } from "../types"

type Props = {
  data?: DetailResponse | null
  isLoading?: boolean
  onSubmit?: (data: FormPayload) => void
}

export const SubmissionForm = ({ data, isLoading, onSubmit }: Props) => {
  const navigate = useNavigate();
  const inputDocumentRef = useRef<HTMLInputElement>(null);

  const {
    data: dataDocument
  } = useQuery({
    queryKey: ['get-document', data?.id],
    queryFn: () => getSubmissionDocument(data?.id || 0),
    enabled: Boolean(data?.id)
  })

  const form = useForm<FormPayload>({
    resolver: zodResolver(data ? UpdateSchema : CreateSchema),
    defaultValues: {
      policyHolderName: "",
      policyHolderNik: "",
      productID: "",
      sumAssured: "",
      annualPremium: "",
      paymentFreq: "",
      status: "UNDER_REVIEW",
      notes: "",
    }
  })

  /* 
    1. button ditekan
    2. zod/schema ke trigger
    3. handle submit dijalankan
  */

  const handleSubmit = (form_data: FormPayload) => {
    const payload = {
      ...form_data,
      status: data ? "RESUBMITTED" : "UNDER_REVIEW"
    }

    onSubmit?.(payload);
  }

  const onCancel = () => {
    form.reset();
    navigate('/pengajuan')
  }

  const calculateValues = (field: string) => {
    const sumAssured = Number(form.getValues('sumAssured'))

    const FORMULA = {
      countAnnualPremium: sumAssured * 0.03,
      countPaymentFreq: null // tambahkan formula baru disini
    };

    switch (field) {
      case 'sumAssured':
        if (sumAssured > 1000000) {
          form.setValue('annualPremium', String(FORMULA.countAnnualPremium))
        } else {
          form.setValue('annualPremium', String(0))
        }
        break;
      case 'annualPremium':
        // tambahkan perhitungan formula baru disini
        break;
      default:
        break;
    }
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
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Card>
          <CardContent>
            <div className="space-y-4 max-w-[500px] mx-auto">
              <FormField
                name="policyHolderName"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input placeholder="Tulis Nama disini..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                name="policyHolderDOB"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Tanggal Lahir</FormLabel>

                      {/* ini calendar */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date"
                            className="w-full justify-between font-normal"
                          >
                            {field.value ? field.value.toLocaleDateString() : "Select date"}
                            <CalendarRangeIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            onSelect={field.onChange}
                            selected={field.value ? new Date(field.value) : undefined}
                            defaultMonth={field.value ? new Date(field.value) : undefined}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                name="policyHolderNik"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>NIK</FormLabel>
                      <FormControl>
                        <Input placeholder="Tulis NIK disini..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                name="productID"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Produk</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="product" className="w-full">
                            <SelectValue placeholder="Pilih Produk..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {products?.map((product) => (
                                <SelectItem key={product.id} value={String(product.id)}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                name="sumAssured"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Uang Pertanggungan</FormLabel>
                      <FormControl>
                        <InputNumber
                          {...field}
                          placeholder="Tulis uang pertanggungan disini..."
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                            calculateValues('sumAssured')
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                name="annualPremium"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Premi Tahunan</FormLabel>
                      <FormControl>
                        <InputNumber
                          {...field}
                          disabled
                          placeholder="Tulis premi tahunan disini..."
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                name="paymentFreq"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Frekuensi Pembayaran</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="payment-freq" className="w-full">
                            <SelectValue placeholder="Pilih frekuensi pembayaran..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {paymentFreqs?.map((freq) => (
                                <SelectItem key={freq.value} value={String(freq.value)}>
                                  {freq.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                name="document"
                control={form.control}
                render={({ field: { ref, value, onChange, ...field} }) => {
                  const handleDeleteFile = () => {
                    onChange(null)
                    if (inputDocumentRef.current) {
                      inputDocumentRef.current.value = ''
                    }
                  }

                  return (
                    <FormItem>
                      <FormLabel>Dokumen Pendukung</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            ref={(el) => {
                              inputDocumentRef.current = el
                              ref(el)
                            }}
                            className={value instanceof File ? "pr-16" : ""}
                            {...field}
                          />

                          {value instanceof File && (
                            <Button
                              size="sm"
                              type="button"
                              variant="destructive"
                              className="absolute right-1 top-[50%] translate-y-[-50%]"
                              onClick={handleDeleteFile}
                            >Hapus</Button>
                          )}
                        </div>
                      </FormControl>

                      {!value && data?.document && (
                        <p className="text-sm text-muted-foreground mt-2">File saat ini: 
                          <Dialog>
                            <DialogTrigger asChild>
                              <span className="text-primary cursor-pointer ml-1.5 hover:underline">Lihat Dokumen</span>
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
                        </p>
                      )}

                      <FormDescription>Unggah file dengan format .pdf, .jpg, atau .png (maks. 2MB)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                name="notes"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Catatan Pendukung</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tulis catatan disini..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex">
          <Button
            type="button"
            variant="outline"
            className="ml-auto"
            disabled={isLoading}
            onClick={onCancel}
          >Batalkan</Button>
          <Button type="submit" disabled={isLoading} className="ml-4">
            {isLoading && <Spinner />}
            <span>Simpan</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}