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

  // const { data: attended } = api.attendence.getTeamsWithAttendanceTrue.useQuery(
  //   {
  //     eventId: "clxnfscr30004cgf4yh6o8670",
  //   },
  // );
  const { data: winners } = api.winner.getWinnersByEventId.useQuery(
   "clxo9upup000361cin6jb9y7b"
  );
  const markwinner = api.winner.createWinner.useMutation({
    onSuccess: async () => {
      console.log("s");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <div className=" flex gap-2">
      {/* {attended?.map((team, index) => (
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
      ))} */}

      <div>
        <pre> winner :{JSON.stringify(winners, null, 2)}</pre>
      </div>

      <button
        onClick={async () => {
          await createteam.mutateAsync({
            eventId: "clxo9upup000361cin6jb9y7b",
            teamName: "ab",
            userId: "clxo9xe6t000144vd3l6s6uu9",
          });
        }}
      >
        create Team
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
      <button
        onClick={async () => {
          await markwinner.mutateAsync({
            teamId: "clxoelqti000213uqpjsh08xy",
            eventId: "clxo9upup000361cin6jb9y7b",
            winnerType: "RUNNER_UP",
          });
        }}
      >
        set winner
      </button>
    </div>
  );
};

export default Test;
