import { zodResolver } from "@hookform/resolvers/zod";
import { type inferProcedureOutput } from "@trpc/server";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { LuLogOut } from "react-icons/lu";
import { toast } from "sonner";
import { z } from "zod";

import { type AppRouter } from "~/server/api/root";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import PaymentButton from "~/components/razorPay/paymentButton";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { registerZ } from "~/zod/authZ";

import { InputOTP, InputOTPSlot } from "../ui/input-otp";

const RegisterForm: FunctionComponent<{
  className?: string;
}> = ({ className }) => {
  const { data: user } = api.user.getUser.useQuery();
  if (!user) return null;
  if (user.memberSince) return <AlreadyMember user={user} />;
  return <InnerRegisterForm className={className} user={user} />;
};

const AlreadyMember: FunctionComponent<{
  user: inferProcedureOutput<AppRouter["user"]["getUser"]>;
}> = ({ user }) => {
  const router = useRouter();
  return (
    <Card className="mt-14 flex flex-col items-center justify-center border-none bg-gradient-to-bl from-[#1e1333] via-[#0a001c]  to-[#0e0a2a] py-4">
      <CardHeader>
        <CardTitle className="text-center text-3xl">
          You&apos;re already a member!
        </CardTitle>
      </CardHeader>
      <CardContent className="flex max-w-prose flex-col gap-3">
        <div className="text-center">
          Hey there! Looks like you&apos;re already part of the club.
        </div>

        <div className="text-center">
          You are currently signed in as{" "}
          <span className="font-bold">{user.name}</span> (
          <span className="font-bold">{user.email}</span>).
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => {
            router.back();
          }}
          size="sm"
        >
          <LuLogOut className="mr-2 size-5" />
          Go Back
        </Button>
      </CardFooter>
    </Card>
  );
};

const InnerRegisterForm: FunctionComponent<{
  user: inferProcedureOutput<AppRouter["user"]["getUser"]>;
  className?: string;
}> = ({ className, user }) => {
  const router = useRouter();

  const register = api.auth.register.useMutation();

  const formSchema = z.object({
    name: z.string(),
    email: z.string(),
    usn: z.string(),
    phone: z.string(),
    branch: z.string(),
    year: z.string(),
    ...registerZ.shape,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      usn: user.usn,
      phone: user.phone,
      branch: user.Branch.name,
      year: user.year,
      reasonToJoin: "",
      expectations: "",
      contribution: "",
      githubLink: "",
      paymentId:
        user.Payment?.paymentType === "MEMBERSHIP" ? user.Payment.id : "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.loading("Registering to FLC...");
    register.mutate(
      {
        reasonToJoin: values.reasonToJoin,
        expectations: values.expectations,
        contribution: values.contribution,
        githubLink: values.githubLink,
        paymentId: values.paymentId,
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success("Registered to FLC successfully!");
          setTimeout(() => void router.push("/profile"), 1000);
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
        className={cn(className, "space-y-4")}
      >
        <h1 className="flex justify-center text-4xl text-white/90">Register</h1>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">Name</FormLabel>
              <FormControl>
                <Input
                  className="bg-[#494949]"
                  placeholder="Name"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-white dark:text-white">
                Personal Email
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-[#494949]"
                  placeholder="Email"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="usn"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-white dark:text-white">USN</FormLabel>
              <FormControl>
                <Input
                  className="bg-[#494949]"
                  placeholder="USN"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex-1 rounded-lg">
              <FormLabel className="text-white dark:text-white">
                Phone
              </FormLabel>
              <FormControl>
                <InputOTP
                  className="bg-[#494949]"
                  maxLength={10}
                  {...field}
                  disabled
                >
                  {Array.from({ length: 10 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="size-6 bg-[#494949] sm:size-10"
                    />
                  ))}
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white dark:text-white">
                  Branch
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#494949]"
                    placeholder="Branch"
                    {...field}
                    disabled
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
                  Year of Graduration
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#494949]"
                    placeholder="Year of Graduration"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="githubLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                Github Link
              </FormLabel>
              <FormControl>
                <Input
                  onFocus={form.handleSubmit(onSubmit)}
                  className="bg-[#494949]"
                  placeholder="Github Link"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reasonToJoin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                Why do you want to join FLC?
              </FormLabel>
              <FormControl>
                <Textarea
                  onFocus={form.handleSubmit(onSubmit)}
                  className="bg-[#494949]"
                  placeholder="Answer"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expectations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                What are your expectations from FLC?
              </FormLabel>
              <FormControl>
                <Textarea
                  onFocus={form.handleSubmit(onSubmit)}
                  className="bg-[#494949]"
                  placeholder="Answer"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                How would you contribute to FLC?
              </FormLabel>
              <FormControl>
                <Textarea
                  onFocus={form.handleSubmit(onSubmit)}
                  className="bg-[#494949]"
                  placeholder="Answer"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Link href="/profile">
            <Button className="bg-red-500 text-white hover:bg-red-600">
              Not interested
            </Button>
          </Link>
          <FormField
            control={form.control}
            name="paymentId"
            render={({ field }) =>
              field.value ? (
                <Button type="submit">Register</Button>
              ) : (
                <FormItem>
                  <FormControl>
                    <PaymentButton
                      className="flex"
                      paymentType="MEMBERSHIP"
                      description="Club Membership"
                      onSuccess={async (paymentId) => {
                        form.setValue("paymentId", paymentId);
                        await form.handleSubmit(onSubmit)();
                      }}
                      onFailure={() => toast.error("Payment failed")}
                      disabled={
                        !form.formState.touchedFields.contribution ||
                        form.getFieldState("contribution").invalid ||
                        form.getFieldState("expectations").invalid ||
                        form.getFieldState("reasonToJoin").invalid ||
                        form.getFieldState("githubLink").invalid
                      }
                      type="submit"
                    />
                  </FormControl>
                </FormItem>
              )
            }
          />
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
