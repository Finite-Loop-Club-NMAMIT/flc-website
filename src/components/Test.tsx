import React from "react";
import { api } from "~/utils/api";
import SubmitFeedback from "./SubmitFeedback";

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
  // const markTeam =
  //   api.attendence.markTeamAttendanceOfPerticularEvent.useMutation({
  //     onSuccess: async () => {
  //       console.log("s");
  //     },
  //     onError: (error) => {
  //       console.log(error);
  //     },
  //   });
  const confrimTeam = api.team.confirmTeam.useMutation({
    onSuccess: async () => {
      console.log("s");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const manuvalAttendence =
    api.attendence.manuallyMarkUserAttendanceForConfirmedTeams.useMutation({
      onSuccess: async () => {
        console.log("s");
      },
      onError: (error) => {
        console.log(error);
      },
    });

  // const { data: teams } = api.team.listAvailableTeams.useQuery({
  //   eventId: "clxo9upup000361cin6jb9y7b",
  //   userId: "clxoqs3o3000013vikv72k7s6",
  // });
  // const { data: teamUsers } =
  //   api.attendence.manuallyRenderUsersOfConfirmedTeams.useQuery({
  //     eventId: "clxo9upup000361cin6jb9y7b",
  //   });
  // const { data: attended } = api.attendence.getTeamsWithAttendanceTrue.useQuery(
  //   {
  //     eventId: "clxnfscr30004cgf4yh6o8670",
  //   },
  // );
  // const { data: winners } = api.winner.getWinnersByEventId.useQuery(
  //   "clxo9upup000361cin6jb9y7b",
  // );
  // const { data: info } = api.team.getTeamsByUserId.useQuery();
  const markwinner = api.winner.createWinner.useMutation({
    onSuccess: async () => {
      console.log("s");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const edit = api.winner.editWinnerType.useMutation({
    onSuccess: async () => {
      console.log("s");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const issuecertificate =
    api.certificate.issueCertificatesForWinnersAndParticipants.useMutation({
      onSuccess: async () => {
        console.log("s");
      },
      onError: (error) => {
        console.log(error);
      },
    });
  const markpoints = api.activitypoints.addActivityPointsForEvent.useMutation({
    onSuccess: async () => {
      console.log("s");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const calculateAndUpdatePoints =
    api.activitypoints.calculateAndUpdateTotalActivityPoints.useMutation();

  const handleCalculateAndUpdate = async () => {
    try {
      await calculateAndUpdatePoints.mutateAsync();
      console.log("Total Activity Points updated successfully!");
    } catch (error) {
      console.error("Error updating total activity points:", error);
    }
  };

  return (
    
    <div className="flex flex-col  gap-3  items-center font-bold">
      <div>
        <button
          className="bg-black p-2 text-white rounded-md "
          onClick={handleCalculateAndUpdate}
        >
          Calculate and Update Total Activity Points
        </button>
      </div>

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
      {/*       
      <div>
        <pre> winner :{JSON.stringify(winners, null, 2)}</pre>
      </div> */}
      {/* <div>
        <pre> Users:{JSON.stringify(teamUsers, null, 2)}</pre>
      </div> */}
      {/* <div>
        <pre> {JSON.stringify(teams)}</pre>
      </div> */}
      {/* <div>
        <pre> {JSON.stringify(info)}</pre>
      </div> */}
      <div>
        <button
          className="rounded-md bg-black p-2 text-white  "
          onClick={async () => {
            await createteam.mutateAsync({
              eventId: "clxo9upup000361cin6jb9y7b",
              teamName: "new",
            });
          }}
        >
          create Team
        </button>
      </div>
      <div>
        <button
          className="rounded-md bg-black p-2 text-white  "
          onClick={async () => {
            await joinTeam.mutateAsync({
              teamId: "clxoqvlmq0001144uh9rql7cd",
            });
          }}
        >
          join Team
        </button>
      </div>
      <div>
        <button
          className="rounded-md bg-black p-2 text-white  "
          onClick={async () => {
            await confrimTeam.mutateAsync({
              teamId: "clxoqvlmq0001144uh9rql7cd",
            });
          }}
        >
          confrim team
        </button>
      </div>
      <div>
        <button
          className="rounded-md bg-black p-2 text-white  "
          onClick={async () => {
            await markwinner.mutateAsync({
              teamId: "clxrj4hfp0000rot46qqbl1fr",
              eventId: "clxoac4vp000013uqr2ne64ff",
              winnerType: "RUNNER_UP",
            });
          }}
        >
          set winner
        </button>
      </div>
      <div>
        <button
          className="rounded-md bg-black p-2 text-white  "
          onClick={async () => {
            await manuvalAttendence.mutateAsync({
              eventId: "clxo9upup000361cin6jb9y7b",
              userId: "clxoa6va3000444vdpr89m38v",
              hasAttended: true,
            });
          }}
        >
          mark manuval attendence
        </button>
      </div>
      <div>
        <button
          className="rounded-md bg-black p-2 text-white  "
          onClick={async () => {
            await edit.mutateAsync({
              winnerId: "clxoemxyj0001c390xs1ewlwq",
              winnerType: "RUNNER_UP",
            });
          }}
        >
          update winner
        </button>
      </div>
      <div>
        <button
          className="rounded-md bg-black p-2 text-white  "
          onClick={async () => {
            await markpoints.mutateAsync({
              eventId: "clxo9upup000361cin6jb9y7b",
              points: 10,
            });
          }}
        >
          mark points
        </button>
      </div>
      <div>
        <button
          className="rounded-md bg-black p-2 text-white  "
          onClick={async () => {
            await issuecertificate.mutateAsync({
              eventId: "clxo9upup000361cin6jb9y7b",
            });
          }}
        >
          participent certificate
        </button>
      </div>
      <SubmitFeedback feedbackTemplateId="clxsyluc50000fzyton0xq0q7" />
    </div>
  );
};

export default Test;
