import useUserStore from "@/store/useUserStore";

import { AlertCircleIcon, MailIcon, CheckCircleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query";
import { resendVerificationEmail } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

function EmailNotVerifiedAlert({ isPending, resendEmail }: { isPending: boolean, resendEmail: () => void }) {
  
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
            onClick={resendEmail}
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

function EmailResentAlert() {
  return (
    <div className="h-dvh flex justify-center py-5">
      <Alert variant="default" className="max-w-xl h-max">
        <CheckCircleIcon />
        <AlertTitle>Verification email sent</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>We've sent a verification email. Please check your inbox (and spam folder).</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}

function Home() {
  const { user } = useUserStore();

  const [hasResentEmail, setHasResentEmail] = useState(false);
  const { mutate: resendVerificationEmailMutation, isPending } = useMutation({
    mutationFn: (userId: string) => resendVerificationEmail(userId),
    onSuccess: () => {
      setHasResentEmail(true);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`)
    }
  })

  if (!user) {
    return null;
  }

  if (hasResentEmail) {
    return <EmailResentAlert />
  }
    
  if (!user.emailVerified) {
    return <EmailNotVerifiedAlert isPending={isPending} resendEmail={() => resendVerificationEmailMutation(user._id)} />
  }

  return (
    <div className="underline text-2xl">Home</div>
  )
}

export default Home