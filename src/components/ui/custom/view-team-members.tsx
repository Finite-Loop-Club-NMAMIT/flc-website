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
import { Check, X } from "lucide-react";
import { type Team } from "@prisma/client";
import { useState } from "react";

export function TeamMembersDialog({ team }: { team: Team[] }) {
  const [teamDetails, setTeamDetails] = useState(team);

  const toggleAttendance = (memberId: string) => {
    setTeamDetails((prevTeamDetails) =>
      prevTeamDetails.map((member) =>
        member.id === memberId
          ? { ...member, hasAttended: !member.hasAttended } 
          : member
      )
    );

    console.log(`Toggling attendance for member: ${memberId}`);
  };

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamDetails.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => toggleAttendance(member.id)}
                    >
                      {member.hasAttended ? (
                        <X className="h-5 w-5 text-red-600" />
                      ) : (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
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
