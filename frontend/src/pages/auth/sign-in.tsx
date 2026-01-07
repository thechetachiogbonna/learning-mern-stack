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
import { loginSchema } from "@/lib/validations"
import { NavLink, useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { loginUser } from "@/lib/api"

function SignIn() {
  const navigate = useNavigate()

  const {
    mutate,
    isPending
  } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => loginUser(data),
    onSuccess: () => {
      form.reset()
      toast.success("Logged in successfully!")
      navigate("/")
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    }
  })

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    validators: {
      onSubmit: loginSchema
    },
    onSubmit: ({ value }) => {
      mutate(value)
    }
  })

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="flex flex-col justify-center items-center">
        <CardTitle>Learning Mern Stack</CardTitle>
        <CardDescription>
          Sign in to continue to Learning Mern Stack
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="sign-in-form"
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="sign-in-form"
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isPending ? "Logging In..." : "Log In"}
        </Button>

        <div>
          Don't have an account?{' '}
          <NavLink to="/auth/sign-up" className="text-pink-600 hover:underline">
            Sign Up
          </NavLink>
        </div>
      </CardFooter>
    </Card>
  )
}

export default SignIn