import React from "react";
import { api } from "~/utils/api";

const Test = () => {
  const joinTeam = api.team.joinTeam.useMutation({
    onSuccess: async () => {
      console.log("s");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const createteam = api.team.createTeam.useMutation({
    onSuccess: async () => {
      console.log("s");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const markTeam =
    api.attendence.markTeamAttendanceOfPerticularEvent.useMutation({
      onSuccess: async () => {
        console.log("s");
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const { data: attended } = api.attendence.getTeamsWithAttendanceTrue.useQuery(
    {
      eventId: "clxnfscr30004cgf4yh6o8670",
    },
  );

  return (
    <div>
      {attended?.map((team, index) => (
        <div key={index} className="team">
          <h2>Team: {team.name}</h2>
          <ul className="members">
            {team.Members.map((member, idx) => (
              <li key={idx}>
                Member: {member.name} (ID: {member.id})
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button
        onClick={async () => {
          await createteam.mutateAsync({
            eventId: "clxnfscr30004cgf4yh6o8670",
            teamName: "a",
            userId: "clxn1cxck0001cgf4v9d342nd",
          });
        }}
      >
        create
      </button>
      <button
        onClick={async () => {
          await joinTeam.mutateAsync({
            teamId: "clxng3gt50001612qvbdusu2y",
            userId: "clxnhdc4t0002612q2zmn9prs",
          });
        }}
      >
        join
      </button>
      <button
        onClick={async () => {
          await markTeam.mutateAsync({
            teamId: "clxng3gt50001612qvbdusu2y",
            eventId: "clxnfscr30004cgf4yh6o8670",
          });
        }}
      >
        join
      </button>
    </div>
  );
};

export default Test;
