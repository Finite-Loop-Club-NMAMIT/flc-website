import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React, { type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { sendVerifyEmailZ } from "~/zod/authZ";

interface Props {
  className?: string;
}

const SendVerifyEmailForm: FunctionComponent<Props> = ({ className }) => {
  const router = useRouter();

  const sendVerificationEmail = api.auth.sendVerifyEmail.useMutation();

  const formSchema = sendVerifyEmailZ;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.loading("Sending verification email");
    sendVerificationEmail.mutate(
      {
        email: values.email.toLowerCase(),
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success("Verification email sent! Please check your email");
          setTimeout(() => void router.push("/sent-verify-email"), 1000);
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
          <Button className=" bg-slate-200 hover:bg-slate-200" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SendVerifyEmailForm;
