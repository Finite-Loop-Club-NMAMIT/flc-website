import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { type User } from "~/store";

export function TeamMembersDialog({ team }: { team: User[]; eventId: number }) {
  /* const toggleAttendance = api.attendance.toggleAttendance.useMutation();
  console.log("Team : ",team) */
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-white">View Members</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Team Members</DialogTitle>
          <DialogDescription>
            Manage the attendance of team members.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {team.map((member) => (
                <tr key={member.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {member.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {member.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <button
                    /* onClick={() =>
                        toggleAttendance.mutate({
                        userId : member.id,
                        eventId : eventId,
                      })} */
                    >
                      {/* {member. ? (
                        <X className="h-5 w-5 text-red-600" />
                      ) : (
                        <Check className="h-5 w-5 text-green-600" />
                      )} */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
