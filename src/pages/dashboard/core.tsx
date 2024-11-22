import { zodResolver } from "@hookform/resolvers/zod";
import { CommandInput } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import { type NextPage } from "next";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { addCoreZ } from "~/zod/core";

const Core: NextPage = () => {
  const addCore = api.core.addCore.useMutation();
  const allUsers = api.user.getAllUsers.useQuery().data;
  const form = useForm<z.infer<typeof addCoreZ>>({
    resolver: zodResolver(addCoreZ),
    defaultValues: {
      position: "",
      priority: "",
      type: "OFFICE_BEARER",
      year: "2024",
      userId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof addCoreZ>) => {
    toast.loading("Adding core member...");
    addCore.mutate(values, {
      onSuccess: () => {
        toast.dismiss;
        toast.success("Core member added successfully");
        form.reset();
      },
      onError: (error) => {
        toast.dismiss();
        toast.error(error.message);
      },
    });
  };

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>();
  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto max-w-xl space-y-2"
            >
              <FormField
                control={form.control}
                name="userId"
                render={({}) => (
                  <FormItem className="w-full sm:min-w-[200px]">
                    <FormLabel className="text-white dark:text-white">
                      Branch
                    </FormLabel>
                    <FormControl>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button isShimmer={false} className={cn("h-10")}>
                            {allUsers?.find(
                              (ele) => ele.id.toString() === value,
                            )?.name ?? "Select User"}
                            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50 " />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0 ">
                          <Command loop>
                            <CommandInput placeholder={"Select User"} />
                            <CommandList>
                              <CommandEmpty>No results.</CommandEmpty>
                              <CommandGroup>
                                {allUsers?.map((ele) => (
                                  <CommandItem
                                    key={ele.id}
                                    value={`${ele.id}`}
                                    onSelect={(currentValue) => {
                                      setValue &&
                                        setValue(
                                          currentValue === value
                                            ? ""
                                            : ele.id.toString(),
                                        );
                                      form.setValue(
                                        "userId",
                                        ele.id.toString(),
                                      );
                                      setOpen(false);
                                    }}
                                    keywords={[ele.name]}
                                    className="text-white"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4 ",
                                        value === ele.id.toString()
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {ele.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white dark:text-white">
                      {" "}
                      Position
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#494949]"
                        placeholder="Position"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white dark:text-white">
                      {" "}
                      Priority
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#494949]"
                        placeholder="Position"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white dark:text-white">
                      {" "}
                      Year
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full rounded-lg bg-[#494949] px-4 py-2">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {["2020", "2021", "2022", "2023", "2024"].map(
                            (year, idx) => (
                              <SelectItem
                                key={idx}
                                value={`${year}`}
                                className="text-white"
                              >
                                {year}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white dark:text-white">
                      {" "}
                      Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value as string}
                      >
                        <SelectTrigger className="w-full rounded-lg bg-[#494949] px-4 py-2">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {["OFFICE_BEARER", "FACULTY_COORDINATOR"].map(
                            (type, idx) => (
                              <SelectItem
                                key={idx}
                                value={`${type}`}
                                className="text-white"
                              >
                                {type}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="bg-[#66209b] font-bold text-white hover:bg-purple-900"
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>

        <button>Seed</button>
      </div>
    </>
  );
};

export default Core;
