import useUserStore from "@/store/useUserStore";

import { AlertCircleIcon, MailIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query";
import { resendVerificationEmail } from "@/lib/api";
import { toast } from "sonner";

function EmailNotVerifiedAlert() {
  const { user } = useUserStore();
  const { mutate: resendVerificationEmailMutation, isPending } = useMutation({
    mutationFn: (userId: string) => resendVerificationEmail(userId)
  })

  return (
    <div className="h-dvh flex justify-center py-5">
      <Alert variant="destructive" className="max-w-xl h-max">
        <AlertCircleIcon />
        <AlertTitle>Email not verified</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>
            Your email address has not been verified yet.
            Please check your inbox and verify your email to continue.
          </p>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 cursor-pointer"
            disabled={isPending}
            style={{ cursor: isPending ? "not-allowed" : "pointer" }}
            onClick={() => {
              if (!user) return toast.error("User not found.");
              resendVerificationEmailMutation(user._id)
            }}
          >
           {isPending ? "Sending..." : (
            <>
              <MailIcon className="h-4 w-4" />
              Resend verification email
            </>
           )}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

function Home() {
  const { user } = useUserStore();

  if (!user?.emailVerified) {
    return <EmailNotVerifiedAlert />
  }

  return (
    <div className="underline text-2xl">Home</div>
  )
}

export default Home