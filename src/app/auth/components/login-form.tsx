import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { login } from "../api"
import { Spinner } from "@/components/ui/spinner"
import z from "zod"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import React from "react"
import { useAuthStore } from "../store"

const schema = z.object({
  email: z.email({ message: "Email harus diisi" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" })
})

type LoginSchema = z.infer<typeof schema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { setToken, setUser } = useAuthStore();

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const {
    mutate: hitLogin,
    isPending: isLoginLoading,
  } = useMutation({
    mutationKey: ['hit-login-api'],
    mutationFn: login,
    onSuccess: (data) => {
      setToken({
        access_token: data?.access_token,
        refresh_token: data?.refresh_token
      });
      setUser(data?.user);

      navigate('/')
    },
    onError: (error: any) => {
      const text_error = error?.response?.data?.message
      setErrorMessage(text_error);

      // errorMessage = text_error
    }
  })

  const onSubmit = (data: LoginSchema) => {
    hitLogin({
      email: data.email,
      password: data.password
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <img className="w-56 mx-auto" src="/logo-bsb.svg" alt="logo-bsb" />
      <Card>
        <CardHeader>
          <CardTitle>Masuk</CardTitle>
          <CardDescription>
            Silakan masukan email Anda untuk mengakses akun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FieldLabel htmlFor="email">Email</FieldLabel>

                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Tulis email disini..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                        </div>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Tulis kata sandi disini..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                {errorMessage && (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                )}
                  <Button type="submit" disabled={isLoginLoading}>
                    {isLoginLoading && <Spinner />}
                    <span>Login</span>
                  </Button>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
