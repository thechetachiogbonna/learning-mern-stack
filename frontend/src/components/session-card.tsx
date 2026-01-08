import queryClient from '@/config/queryClient';
import { revokeSession } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge, ClockIcon, MapPinIcon, MonitorIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from './ui/button';

function SessionCard({ session }: { session: Session }) {
  const { mutate: removeSession, isPending: isRemovingSession } = useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSuccess: (_, removedSessionId) => {
      console.log("variables:", removedSessionId);
      queryClient.setQueryData(["sessions"], (oldData: any) => {
        return {
          sessions: oldData.sessions.filter((session: any) => session._id !== removedSessionId)
        };
      });
    }
  });

  return (
    <Card key={session._id} className="max-w-xl">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <MonitorIcon className="h-4 w-4" />
            Active Session
          </CardTitle>

          {session.isCurrent && (
            <Badge className="w-fit">
              <ShieldCheckIcon className="mr-1 h-3 w-3" />
              Current session
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          <span>{session.ipAddress}</span>
        </div>

        <div className="text-muted-foreground break-all">
          {session.userAgent}
        </div>

        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
          <span>Created: {session.createdAt}</span>
        </div>

        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
          <span>Expires: {session.expiresAt}</span>
        </div>

        {!session.isCurrent && (
          <Button
            variant="destructive"
            size="sm"
            className="mt-2"
            onClick={() => removeSession(session._id)}
            disabled={isRemovingSession}
          >
            {isRemovingSession ? "Revoking..." : "Revoke session"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default SessionCard