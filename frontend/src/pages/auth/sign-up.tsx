import { useForm } from "@tanstack/react-form"
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { registerUserSchema } from "@/lib/validations"
import { NavLink, useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "@/lib/api"

function SignUp() {
  const navigate = useNavigate();

  const {
    mutate,
    isPending
  } = useMutation({
    mutationFn: (data: { email: string; password: string, confirmPassword: string }) => registerUser(data),
    onSuccess: () => {
      form.reset()
      toast.success("Account created successfully!")
      navigate("/", { replace: true });
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    }
  })

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    validators: {
      onSubmit: registerUserSchema
    },
    onSubmit: ({ value }) => {
      mutate({
        email: value.email,
        password: value.password,
        confirmPassword: value.confirmPassword
      })
    }
  })

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="flex flex-col justify-center items-center">
        <CardTitle>Learning Mern Stack</CardTitle>
        <CardDescription>
          Sign up to continue to Learning Mern Stack
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="sign-up-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="capitalize"
                    >
                      {field.name}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Email address"
                      autoComplete="on"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="capitalize"
                    >
                      {field.name}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Password"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="capitalize"
                    >
                      {field.name}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Confirm Password"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="sign-up-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <NavLink to="/auth/sign-in" className="font-medium text-blue-600 hover:underline">
            Sign In
          </NavLink>
        </p>
      </CardFooter>
    </Card>
  )
}

export default SignUp