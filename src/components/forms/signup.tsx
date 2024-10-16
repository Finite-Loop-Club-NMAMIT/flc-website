import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import { ComboBox } from "~/components/ui/custom/combobox";
import { Password } from "~/components/ui/custom/password";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { cn, getGraduationYears } from "~/lib/utils";
import { api } from "~/utils/api";
import { signUpZ } from "~/zod/authZ";

interface Props {
  className?: string;
}

const SignUpForm: FunctionComponent<Props> = ({ className }) => {
  const router = useRouter();

  const { data: branches } = api.branch.getAllBranch.useQuery();

  const signUp = api.auth.signUp.useMutation();

  const formSchema = signUpZ;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      usn: "",
      phone: "",
      branchId: "",
      year: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.loading("Signing up...");
    signUp.mutate(
      {
        branchId: values.branchId,
        confirmPassword: values.confirmPassword,
        email: values.email.toLowerCase(),
        usn: values.usn,
        name: values.name,
        password: values.password,
        phone: values.phone,
        year: values.year,
      },
      {
        onSuccess: ({ emailSent }) => {
          toast.dismiss();
          if (emailSent) {
            toast.success("Verification email sent! Please check your inbox");
            setTimeout(() => void router.push("/sent-verify-email"), 1000);
          } else {
            toast.success("Signed up successfully! Please verify your email");
            setTimeout(() => void router.push("/send-verify-email"), 1000);
          }
        },
        onError: (error) => {
          toast.dismiss();
          toast.error(error.message);
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
        <FormMessage className="flex justify-center text-4xl font-bold text-white/90">
          Signup
        </FormMessage>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                {" "}
                Name
              </FormLabel>
              <FormControl>
                <Input className="bg-[#494949]" placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                Personal Email
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-[#494949]"
                  placeholder="Personal Email"
                  {...field}
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
            <FormItem>
              <FormLabel className="text-white dark:text-white">USN</FormLabel>
              <FormControl>
                <Input className="bg-[#494949]" placeholder="USN" {...field} />
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
                <InputOTP className="bg-[#494949]" maxLength={10} {...field}>
                  <InputOTPGroup>
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <InputOTPSlot
                        key={idx}
                        index={idx}
                        className="size-8 bg-[#494949] sm:size-10"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <FormField
            control={form.control}
            name="branchId"
            render={({ field }) => (
              <FormItem className="w-full sm:min-w-[200px]">
                <FormLabel className="text-white dark:text-white">
                  Branch
                </FormLabel>
                <FormControl>
                  <ComboBox
                    className="w-full rounded-lg bg-[#494949] py-2"
                    data={branches ?? []}
                    value={field.value}
                    setValue={field.onChange}
                    placeholder="Search branch..."
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
              <FormItem className="w-full sm:min-w-[200px]">
                <FormLabel className="text-white dark:text-white">
                  Year of Graduation
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full rounded-lg bg-[#494949] px-4 py-2">
                      <SelectValue placeholder="Choose Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="2028" className="text-white">
                        2028 1st B.Tech
                      </SelectItem> */}
                      {getGraduationYears().map((year, idx) => (
                        <SelectItem
                          key={idx}
                          value={`${year}`}
                          className="text-white"
                        >
                          {year} (
                          {idx === 0
                            ? "4th B.Tech, 2nd MCA"
                            : idx === 1
                              ? "3rd B.Tech, 1st MCA"
                              : idx === 2
                                ? "2nd B.Tech"
                                : idx === 3
                                  ? "1st B.Tech"
                                  : ""}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                Password
              </FormLabel>
              <FormControl>
                <Password
                  className="bg-[#494949]"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Password
                  className="bg-[#494949]"
                  placeholder="Confirm Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col justify-center gap-2 py-1">
          <Button
            className="bg-[#66209b] font-bold text-white hover:bg-purple-900"
            type="submit"
          >
            Submit
          </Button>
          <p className="mb-4 text-center text-base text-white dark:text-white">
            Already have an account?&nbsp;
            <strong className="underline">
              <Link href="/auth/login">Login </Link>
            </strong>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
