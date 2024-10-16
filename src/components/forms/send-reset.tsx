import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { sendPasswordResetZ } from "~/zod/authZ";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SendResetForm = ({ className }: { className?: string }) => {
  const router = useRouter();

  const sendPasswordResetEmail = api.auth.sendPasswordResetEmail.useMutation();

  const formSchema = sendPasswordResetZ;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.loading("Sending reset password email...");
    sendPasswordResetEmail.mutate(
      {
        email: values.email.toLowerCase(),
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success("Reset email sent! Please check your email");
          setTimeout(() => void router.push("/sent-reset-email"), 1000);
        },
        onError: ({ message }) => {
          toast.dismiss();
          toast.error(message);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "space-y-8")}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-[#494949]"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button className="bg-slate-200 hover:bg-slate-200" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SendResetForm;
