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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-8 w-[1200px] h-[600px] flex  flex-col"
      >
        <div className="w-full ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-2/4">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="My MultiSig Wallet..."
                    {...field}
                    className="h-24  border-none focus:outline-none radius-md text-6xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className=" h-[400px] flex flex-wrap gap-4">
          <FormField
            control={form.control}
            name="owners"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Owners</FormLabel>
                <FormControl>
                  <Input placeholder="0xABC123..." {...field} />
                </FormControl>
                <FormDescription className="text-center">
                  Enter the addresses of the owners separated by commas as an
                  array ( e.g [wallet1, wallet 2, ...] ).
                </FormDescription>
                <FormMessage />
                <Button>Add Owner</Button>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiredMinimumThreshold"
            render={({ field }) => (
              <FormItem className="w-2/4">
                <FormLabel>Minimum Threshold</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormDescription className="text-center">
                  The minimum number of approvals required to execute a
                  transaction and vote on a proposal within the wallet handler.
                  Please note that this value cannot be changed after your
                  contract has been deployed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiredInitialApprovals"
            render={({ field }) => (
              <FormItem className="w-1/3">
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
              <FormItem className="w-1/3">
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
        </div>
        <Button type="submit">Create Wallet</Button>
      </form>
    </Form>
  );
}
