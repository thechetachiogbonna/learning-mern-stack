import queryClient from '@/config/queryClient';
import { revokeSession } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ClockIcon, Loader2, MapPinIcon, MonitorIcon, ShieldCheckIcon, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
    <Card className="max-w-xl mx-auto">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <MonitorIcon className="h-4 w-4" />
          Active Session
        </CardTitle>

        {session.isCurrent
          ? (
            <Badge className="mt-2 flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4" />
              Current Session
            </Badge>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              className="mt-2"
              onClick={() => removeSession(session._id)}
              disabled={isRemovingSession}
            >
              {isRemovingSession
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Trash2 className="h-4 w-4" />
              }
            </Button>
          )}
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
      </CardContent>
    </Card>
  )
}

export default SessionCard