"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  owners: z.array(
    z.string().min(42, { message: "Owner address must be 42 characters long." })
  ),
  requiredMinimumThreshold: z
    .number()
    .min(1, { message: "Minimum threshold must be at least 1." }),
  requiredInitialApprovals: z
    .number()
    .min(1, { message: "Initial approvals must be at least 1." }),
  requiredInitialVotes: z
    .number()
    .min(1, { message: "Initial votes must be at least 1." }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
});

export function CreateWalletForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owners: [],
      requiredMinimumThreshold: 1,
      requiredInitialApprovals: 1,
      requiredInitialVotes: 1,
      name: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="owners"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owners</FormLabel>
              <FormControl>
                <Input placeholder="0xABC123..." {...field} />
              </FormControl>
              <FormDescription>
                Enter the addresses of the owners separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requiredMinimumThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Threshold</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormDescription>
                The minimum number of approvals required to execute a
                transaction.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requiredInitialApprovals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Approvals</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormDescription>
                The initial number of approvals required to execute a
                transaction.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requiredInitialVotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Votes</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormDescription>
                The initial number of votes required to vote on a proposal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My MultiSig Wallet" {...field} />
              </FormControl>
              <FormDescription>
                A name identifier for the MultiSigWallet.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Wallet</Button>
      </form>
    </Form>
  );
}
