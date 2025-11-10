import { LoginForm } from "@/app/auth/components/login-form"
import { useEffect } from "react"
import { useNavigate } from "react-router";
import { useAuthStore } from "../store";

export const Login = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  /* Check if user is already logged in */
  useEffect(() => {
    if (token?.access_token) navigate("/")
  }, [token, navigate])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
