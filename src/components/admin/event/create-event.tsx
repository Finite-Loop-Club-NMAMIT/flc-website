"use client";

import { EventCategory, EventState, EventType } from "@prisma/client";
import React, { useState } from "react";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { DatePicker } from "~/components/ui/custom/date-picker";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import Editor from "~/components/textEditor/editor";
import { api } from "~/utils/api";
import { type createEventZ } from "~/zod/eventZ";

// import Editor from "../textEditor/editor";
// import { Button } from "../ui/button";
// import { Card, CardContent } from "../ui/card";
// import { Checkbox } from "../ui/checkbox";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import {
//  Select,
//  SelectContent,
//  SelectItem,
//  SelectTrigger,
//  SelectValue,
// } from "../ui/select";

const CreateEvent: React.FC = () => {
  const createEvent = api.event.createEvent.useMutation();

  const [formValues, setFormValues] = useState<z.infer<typeof createEventZ>>({
    name: "",
    imgSrc: "",
    deadline: undefined,
    fromDate: new Date(),
    toDate: new Date(),
    description: "",
    venue: "",
    eventType: "TEAM",
    minTeamSize: 0,
    maxTeamSize: 4,
    maxTeams: 20,
    category: "COMPETITION",
    flcAmount: 0,
    nonFlcAmount: 0,
    state: "DRAFT",
    isLegacy: false,
    isMembersOnly: false,
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.FormEvent<HTMLButtonElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    const { id, value, type } = target;
    const checked = target.checked;

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [id]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  return (
    <Card className="mx-auto flex w-[70%] flex-col border-none bg-[#4e5258] py-8 shadow-md">
      <CardContent className="flex flex-1 flex-col">
        <form className="flex flex-1 flex-col">
          <div className="flex w-full flex-1 flex-col items-center gap-4">
            <div className="flex w-full flex-col space-y-1.5">
              <Label className="text-black-100 font-bold" htmlFor="name">
                Event name
              </Label>
              <Input
                className="bg-white font-normal text-black hover:text-black focus:bg-white focus-visible:border-slate-400"
                id="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Name of your event"
              />
            </div>

            <div className="flex w-full flex-col space-y-1.5">
              <Label className="text-black-100 font-bold" htmlFor="imgSrc">
                Image Source (optional)
              </Label>
              <Input
                className="bg-white font-normal text-black hover:text-black focus:bg-white focus-visible:border-slate-400"
                id="imgSrc"
                value={formValues.imgSrc}
                onChange={handleChange}
                placeholder="Image URL"
              />
            </div>

            <div className="flex w-full flex-col space-y-1.5">
              <Label className="font-bold text-white" htmlFor="deadline">
                Deadline (optional)
              </Label>
              <DatePicker
                date={formValues.deadline}
                setDate={(date) =>
                  handleSelectChange("deadline", date as unknown as string)
                }
                placeholder="Pick a deadline"
              />
            </div>

            <div className="flex w-full space-x-4">
              <div className="flex w-full flex-col space-y-1.5">
                <Label className="text-black-100 font-bold" htmlFor="fromDate">
                  From Date
                </Label>
                <DatePicker
                  date={formValues.fromDate}
                  setDate={(date) =>
                    handleSelectChange("fromDate", date as unknown as string)
                  }
                  placeholder="Pick a from date"
                />
              </div>

              <div className="flex w-full flex-col space-y-1.5">
                <Label className="text-black-100 font-bold" htmlFor="toDate">
                  To Date
                </Label>
                <DatePicker
                  date={formValues.toDate}
                  setDate={(date) =>
                    handleSelectChange("toDate", date as unknown as string)
                  }
                  placeholder="Pick a to date"
                />
              </div>
            </div>

            <div className="flex w-full flex-1 flex-col space-y-1.5">
              <Label className="text-black-100 font-bold" htmlFor="description">
                Description (optional)
              </Label>
              <Editor
                id="description"
                value={formValues.description}
                FUNC={handleChange}
              ></Editor>
              {/* <Textarea
                className="bg-white font-normal text-black focus:bg-white focus-visible:border-slate-400"
                id="description"
                value={formValues.description}
                onChange={handleChange}
              /> */}
            </div>

            <div className="flex w-full flex-col space-y-1.5">
              <Label className="text-black-100 font-bold" htmlFor="venue">
                Venue (optional)
              </Label>
              <Input
                className="bg-white font-normal text-black hover:text-black focus:bg-white focus-visible:border-slate-400"
                id="venue"
                value={formValues.venue}
                onChange={handleChange}
                placeholder="Venue of your event"
              />
            </div>

            <div className="flex w-full flex-col space-y-1.5">
              <Label className="text-black-100 font-bold" htmlFor="type">
                Type
              </Label>
              <Select
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value={formValues.eventType}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="bg-white text-slate-400" id="type">
                  <SelectValue
                    className="text-slate-400"
                    placeholder="Select"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white" position="popper">
                  <SelectItem
                    className="bg-white text-black hover:bg-slate-100"
                    value={EventType.SOLO}
                  >
                    Solo
                  </SelectItem>
                  <SelectItem
                    className="bg-white text-black hover:bg-slate-100"
                    value={EventType.TEAM}
                  >
                    Team
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full space-x-4">
              <div className="flex w-full flex-col space-y-1.5">
                <Label
                  className="text-black-100 font-bold"
                  htmlFor="minTeamSize"
                >
                  Min Team Size
                </Label>
                <Input
                  className="bg-white font-normal text-black hover:text-black focus:bg-white focus-visible:border-slate-400"
                  id="minTeamSize"
                  type="number"
                  value={formValues.minTeamSize}
                  onChange={handleChange}
                  placeholder="Minimum team size"
                />
              </div>

              <div className="flex w-full flex-col space-y-1.5">
                <Label
                  className="text-black-100 font-bold"
                  htmlFor="maxTeamSize"
                >
                  Max Team Size
                </Label>
                <Input
                  className="bg-white font-normal text-black hover:text-black focus:bg-white focus-visible:border-slate-400"
                  id="maxTeamSize"
                  type="number"
                  value={formValues.maxTeamSize}
                  onChange={handleChange}
                  placeholder="Maximum team size"
                />
              </div>
            </div>

            <div className="flex w-full flex-col space-y-1.5">
              <Label className="text-black-100 font-bold" htmlFor="maxTeams">
                Max Teams
              </Label>
              <Input
                className="bg-white font-normal text-black hover:text-black focus:bg-white focus-visible:border-slate-400"
                id="maxTeams"
                type="number"
                value={formValues.maxTeams}
                onChange={handleChange}
                placeholder="Maximum number of teams"
              />
            </div>

            <div className="flex w-full flex-col space-y-1.5">
              <Label className="text-black-100 font-bold" htmlFor="category">
                Category
              </Label>
              <Select
                value={formValues.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger
                  className="bg-white text-slate-400"
                  id="category"
                >
                  <SelectValue
                    className="text-slate-400"
                    placeholder="Select"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white" position="popper">
                  <SelectItem
                    className="bg-white text-black hover:bg-slate-100"
                    value={EventCategory.WORKSHOP}
                  >
                    Workshop
                  </SelectItem>
                  <SelectItem
                    className="bg-white text-black hover:bg-slate-100"
                    value={EventCategory.COMPETITION}
                  >
                    Competition
                  </SelectItem>
                  <SelectItem
                    className="bg-white text-black hover:bg-slate-100"
                    value={EventCategory.HACKATHON}
                  >
                    Hackathon
                  </SelectItem>
                  <SelectItem
                    className="bg-white text-black hover:bg-slate-100"
                    value={EventCategory.SPECIAL}
                  >
                    Special
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-col space-y-1.5">
              <Label className="text-black-100 font-bold" htmlFor="flcAmount">
                flc Amount
              </Label>
              <Input
                className="bg-white font-normal text-black hover:text-black focus:bg-white focus-visible:border-slate-400"
                id="flcAmount"
                type="number"
                value={formValues.flcAmount}
                onChange={handleChange}
                placeholder="Event amount"
              />
            </div>
            <div className="flex w-full flex-col space-y-1.5">
              <Label
                className="text-black-100 font-bold"
                htmlFor="nonFlcAmount"
              >
                non FlcAmount
              </Label>
              <Input
                className="bg-white font-normal text-black hover:text-black focus:bg-white focus-visible:border-slate-400"
                id="nonFlcAmount"
                type="number"
                value={formValues.nonFlcAmount}
                onChange={handleChange}
                placeholder="Event amount"
              />
            </div>

            <div className="flex w-full flex-col space-y-1.5">
              <Label className="text-black-100 font-bold" htmlFor="state">
                State
              </Label>
              <Select
                value={formValues.state}
                onValueChange={(value) => handleSelectChange("state", value)}
              >
                <SelectTrigger className="bg-white text-slate-400" id="state">
                  <SelectValue
                    className="text-slate-400"
                    placeholder="Select"
                  />
                </SelectTrigger>
                <SelectContent className="bg-white" position="popper">
                  <SelectItem
                    className="bg-white text-black hover:bg-slate-100"
                    value={EventState.DRAFT}
                  >
                    Draft
                  </SelectItem>
                  <SelectItem
                    className="bg-white text-black hover:bg-slate-100"
                    value={EventState.PUBLISHED}
                  >
                    Published
                  </SelectItem>
                  <SelectItem
                    className="bg-white text-black hover:bg-slate-100"
                    value={EventState.COMPLETED}
                  >
                    Completed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full items-center space-x-2">
              <Checkbox
                id="isLegacy"
                checked={formValues.isLegacy}
                onChange={handleChange}
              />
              <Label className="text-black-100 font-bold" htmlFor="isLegacy">
                Is Legacy
              </Label>
            </div>
            <div className="flex w-full items-center space-x-2">
              <Checkbox
                id="isMembersOnly"
                checked={formValues.isMembersOnly}
                onChange={handleChange}
              />
              <Label
                className="text-black-100 font-bold"
                htmlFor="isMembersOnly"
              >
                Is MembersOnly
              </Label>
            </div>
          </div>
        </form>
        <div className="flex justify-end">
          <Button
            variant="default"
            className="ml-auto"
            onClick={() => {
              console.log(formValues);
              createEvent.mutate({
                flcAmount: formValues.flcAmount,
                nonFlcAmount: formValues.nonFlcAmount,
                category: formValues.category,
                deadline: formValues.deadline,
                description: formValues.description,
                fromDate: formValues.fromDate ?? new Date(),
                imgSrc: formValues.imgSrc,
                isLegacy: formValues.isLegacy,
                maxTeamSize: formValues.maxTeamSize,
                maxTeams: formValues.maxTeams,
                minTeamSize: formValues.minTeamSize,
                name: formValues.name,
                state: formValues.state,
                toDate: formValues.toDate,
                isMembersOnly: formValues.isMembersOnly,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                eventType: formValues.eventType,
                venue: formValues.venue,
              });
            }}
          >
            Create Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateEvent;
