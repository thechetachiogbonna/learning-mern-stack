import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NavLink, useSearchParams } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "@/lib/api"
import { useState, useEffect } from "react"
import { CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react"

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string | null>(null)

  useEffect(() => {
    const verificationCodeFromUrl = searchParams.get("verificationCode")
    const exp = searchParams.get("exp")
    const hasExpired = exp ? Date.now() > parseInt(exp) : true
    if (!verificationCodeFromUrl || hasExpired) {
      toast.error("Invalid or missing reset token")
    }
    setVerificationCode(verificationCodeFromUrl)
  }, [searchParams])

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setIsPasswordReset(true)
      toast.success("Password reset successfully!")
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    }
  })

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
    validators: {
      onSubmit: z.object({
        password: z.string()
          .min(8, "Password must be at least 8 characters")
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[a-z]/, "Password must contain at least one lowercase letter")
          .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z.string()
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
      })
    },
    onSubmit: ({ value }) => {
      if (!verificationCode) {
        toast.error("Invalid reset token")
        return
      }
      mutate({ verificationCode, password: value.password })
    }
  })

  if (!verificationCode) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
          <CardDescription className="mt-2">
            This password reset link is invalid or has expired. Please request a new password reset link.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <NavLink to="/auth/forgot-password" className="w-full">
            <Button className="w-full">
              Request New Reset Link
            </Button>
          </NavLink>
        </CardFooter>
      </Card>
    )
  }

  if (isPasswordReset) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
          <CardDescription className="mt-2">
            Your password has been reset successfully. You can now sign in with your new password.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <NavLink to="/auth/sign-in" className="w-full">
            <Button className="w-full">
              Continue to Sign In
            </Button>
          </NavLink>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>
          Enter your new password below. Make sure it's strong and secure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={isPending}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {isInvalid && (
                  <FieldError>
                    {field.state.meta.errors.join(", ")}
                  </FieldError>
                )}
                <div className="mt-2 space-y-1 text-xs text-gray-600">
                  <p>Password must contain:</p>
                  <ul className="list-inside list-disc space-y-0.5">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                  </ul>
                </div>
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Confirm New Password</FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showConfirmPassword ? "text" : "password"}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={isPending}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {isInvalid && (
                  <FieldError>
                    {field.state.meta.errors.join(", ")}
                  </FieldError>
                )}
              </Field>
            )
          }}
        </form.Field>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="button"
          className="w-full"
          disabled={isPending}
          onClick={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {isPending ? "Resetting Password..." : "Reset Password"}
        </Button>
        <p className="text-center text-sm text-gray-600">
          Remember your password?{' '}
          <NavLink to="/signin" className="font-medium text-blue-600 hover:underline">
            Sign In
          </NavLink>
        </p>
      </CardFooter>
    </Card>
  )
}

export default ResetPassword