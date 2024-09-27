/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useZxing, type Result } from "react-zxing";
import { toast } from "sonner";

import NotFound from "~/pages/404";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { api } from "~/utils/api";

export default function Attendance() {
  const { data: user } = useSession();
  const [attendedUser, setAttndeduser] = useState<{
    teamId: string;
    name: string;
  } | null>(null);
  const updateAttendance = api.attendance.markTeamAttendance.useMutation({
    onSuccess: () => {
      toast.dismiss("attendance");
      toast.success("Attendance marked successfully");
      setResult(null);
    },
    onError: (error) => {
      toast.dismiss("attendance");
      toast.error(error.message);
    },
  });

  if (updateAttendance.isPending) {
    toast.loading("Marking attendance...", { id: "attendance" });
  }

  const [result, setResult] = useState<string | null>(null);
  const { ref } = useZxing({
    onDecodeResult(result: Result) {
      setResult(result.getText());
      stopCamera();
    },
  });

  const stopCamera = () => {
    const stream = ref.current?.srcObject as MediaStream;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => {
      track.stop();
    });
  };

  const startCamera = async () => {
    await navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        const video = ref.current;
        if (video) {
          video.srcObject = stream;
        }
      });
  };

  if (
    !user ||
    (user?.user.role !== "ORGANISER" && user?.user.role !== "ADMIN")
  ) {
    return <NotFound />;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950">
        <video className="w-full rounded-lg border border-gray-400" ref={ref} />
        {!result && (
          <div className="mt-2 text-center text-sm text-gray-400">
            <span className="text-green-500">Note:</span> Detection is retried
            every 300ms. If you are not seeing the detection, try moving the
            camera closer to the QR code.
          </div>
        )}
        {result && <Badge color={"info"}>Scanned ID: {result}</Badge>}

        {result && (
          <Button
            onClick={async () => {
              await updateAttendance
                .mutateAsync({
                  eventId: 40,
                  teamId: result,
                })
                .then((res) => {
                  setAttndeduser({ teamId: res.id, name: res.name });
                });
            }}
          >
            Mark Attendance
          </Button>
        )}
        {!result && (
          <Button
            onClick={async () => {
              setAttndeduser(null);
              await startCamera();
            }}
          >
            Scan
          </Button>
        )}
        {attendedUser && (
          <Card className="dark mx-5 py-8">
            <CardHeader>
              <CardTitle>Attended User</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col text-xl text-green-500">
              <div className="font-bold">{attendedUser.name}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
