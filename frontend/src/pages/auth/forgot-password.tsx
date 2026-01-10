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
import { NavLink } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { requestPasswordReset } from "@/lib/api"
import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

function ForgotPassword() {
  const [isResetPasswordSent, setIsResetPasswordSent] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      setIsResetPasswordSent(true)
      toast.success("Password reset email sent successfully!")
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    }
  })

  const form = useForm({
    defaultValues: {
      email: ""
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email("Please enter a valid email address")
      })
    },
    onSubmit: ({ value }) => {
      mutate(value.email)
    }
  })

  if (isResetPasswordSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription className="mt-2">
            We've sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-medium">Didn't receive the email?</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-blue-700">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes for the email to arrive</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsResetPasswordSent(false)}
          >
            Try Another Email
          </Button>
          <NavLink to="/auth/sign-in" className="w-full">
            <Button variant="ghost" className="w-full">
              Back to Sign In
            </Button>
          </NavLink>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Learning Mern Stack</CardTitle>
        <CardDescription>
          Enter your email to receive password reset instructions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Email address"
                  autoComplete="on"
                  disabled={isPending}
                />
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
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
          {isPending ? "Sending..." : "Send Reset Link"}
        </Button>
        <p className="text-center text-sm text-gray-600">
          Remember your password?{' '}
          <NavLink to="/auth/sign-in" className="font-medium text-blue-600 hover:underline">
            Sign In
          </NavLink>
        </p>
      </CardFooter>
    </Card>
  )
}

export default ForgotPassword