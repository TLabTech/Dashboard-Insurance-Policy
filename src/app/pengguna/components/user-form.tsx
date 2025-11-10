import React, { useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { FormPayload, RolesResponse } from "../types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormSchema } from "../schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectItem, SelectContent, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { getUserRoles } from "../api"
import { Spinner } from "@/components/ui/spinner"

import branchs from "@/constants/branchs.json"

type Props = {
  data?: any
  isLoading?: boolean
  onSubmit?: (data: FormPayload) => void
}

export const UserForm = ({ data, isLoading, onSubmit }: Props) => {
  const navigate = useNavigate();

  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  const {
    data: dataRoles,
    isFetching: isFetchingRoles
  } = useQuery({
    queryKey: ['roles'],
    queryFn: getUserRoles
  })

  const form = useForm<FormPayload>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      roleID: "",
      branchID: ""
    }
  })

  const handleSubmit = (data: FormPayload) => {
    onSubmit?.(data)
  }

  const onCancel = () => {
    form.reset();
    navigate('/pengguna')
  }

  useEffect(() => {
    if (!isLoading && data) {
      form.reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roleID: String(data.roleID),
        branchID: String(data.branchID)
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
                name="firstName"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Nama Depan</FormLabel>
                      <FormControl>
                        <Input placeholder="Tulis Nama Depan disini..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Nama Belakang</FormLabel>
                      <FormControl>
                        <Input placeholder="Tulis Nama Belakang disini..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Tulis Email disini..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              {!data && (
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Kata Sandi</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={isPasswordVisible ? 'text' : 'password'} placeholder="Tulis Kata Sandi disini..." {...field} />

                            {isPasswordVisible ? (
                              <EyeOffIcon
                                className="absolute right-3 top-2.5 cursor-pointer h-4 w-4 z-10"
                                onClick={() => setIsPasswordVisible(false)}
                              />
                            ) : (
                              <EyeIcon
                                className="absolute right-3 top-2.5 cursor-pointer h-4 w-4 z-10"
                                onClick={() => setIsPasswordVisible(true)}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              )}
              <FormField
                name="roleID"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="role" className="w-full capitalize">
                            <SelectValue placeholder="Pilih Role..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {isFetchingRoles && <Spinner />}

                              {!isFetchingRoles && dataRoles?.data?.map((role: RolesResponse) => (
                                <SelectItem
                                  key={role.id}
                                  value={String(role.id)}
                                  className="capitalize"
                                >
                                  {role.name}
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
                name="branchID"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Cabang</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="branch" className="w-full">
                            <SelectValue placeholder="Pilih Cabang..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {branchs?.map((branch) => (
                                <SelectItem key={branch.id} value={String(branch.id)}>
                                  {branch.name}
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