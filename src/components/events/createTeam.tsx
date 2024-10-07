import React, { useState, type FunctionComponent } from "react";
import { toast } from "sonner";

import { api } from "~/utils/api";

import { Input } from "../ui/input";

interface CreateTeamProps {
  eventId: number;
  onTeamCreate: () => void;
  onGoBack: () => void;
}

const CreateTeam: FunctionComponent<CreateTeamProps> = ({
  eventId,
  onTeamCreate,
  onGoBack,
}) => {
  const [teamName, setTeamName] = useState("");

  const createTeam = api.team.createTeam.useMutation();

  const handleCreateTeam = () => {
    if (!teamName) {
      toast.error("Please enter team name");
      return;
    }
    toast.loading("Creating team...");
    createTeam.mutate(
      { eventId: eventId, teamName: teamName },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success("Team successfully created");
          onTeamCreate();
        },
        onError: ({ message }) => {
          toast.dismiss();
          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="mt-4 text-white">
      <Input
        placeholder="Enter Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="card-attributes"
      />
      <div className="flex justify-between">
        <button
          className="card-button mt-4 text-xs"
          style={{ padding: "0.1rem 0.5rem" }}
          onClick={handleCreateTeam}
        >
          Create
        </button>
        <button
          onClick={onGoBack}
          className="card-button mt-4 text-xs"
          style={{ padding: "0.1rem 0.5rem" }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default CreateTeam;
