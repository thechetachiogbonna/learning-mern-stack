import SessionCard from "@/components/session-card";
import { getSessions } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

function Settings() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions
  });

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading settings</div>

  return (
    <div className="flex flex-col justify-start gap-4 py-4 h-screen w-full">
      {data?.sessions.map((session: Session) => (
        <SessionCard key={session._id} session={session} />
      ))}
    </div>
  );
}

export default Settings