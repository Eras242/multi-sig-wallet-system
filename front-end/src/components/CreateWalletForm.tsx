"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import { Separator } from "./ui/separator";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
import { CreateWalletDialog } from "./CreateWalletDialog";

const formSchema = z.object({
  owners: z.array(
    z.string().min(42, { message: "Owner address must be 42 characters long." })
  ),
  requiredMinimumThreshold: z
    .string()
    .transform((v) => parseInt(v, 10))
    .min(1, { message: "Minimum threshold must be at least 1." }),
  requiredInitialApprovals: z
    .string()
    .min(1, { message: "Initial approvals must be at least 1." }),
  requiredInitialVotes: z
    .string()
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
    console.log("submitted form data:", data);
    // Handle form submission
  };

  const [owners, setOwners] = useState([]);

  const addOwner = (newOwner: string) => {
    // setOwners((prev) => (prev ? [...prev, newOwner] : prev));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-8 w-[1200px] h-[600px] flex flex-col"
      >
        <div className="w-full ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="My MultiSig Wallet..."
                    {...field}
                    className="h-24  border-none focus:outline-none focus:ring-0 focus:border-none-none radius-md text-6xl font-semibold p-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className=" h-auto mt-12">
          <div className="  w-full ">
            <FormField
              control={form.control}
              name="owners"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Owners</FormLabel>
                  <div className="flex row gap-8 w-full ">
                    <FormControl>
                      <Input placeholder="0xABC123..." {...field} />
                    </FormControl>
                    <Button className="w-1/4">Add Owner</Button>
                  </div>
                  <FormDescription className="text-center self-start">
                    Add an owner individually or simply enter the addresses of
                    the owners as an array ( e.g [wallet1, wallet2, ...] ).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className=" flex flex-row gap-8 justify-evenly mt-12">
            <FormField
              control={form.control}
              name="requiredMinimumThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Requried Approvals</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormDescription className="text-center">
                    The minimum number of approvals required to execute a
                    transaction and vote on a proposal both within the wallet
                    and it's handler.{" "}
                    <i>
                      Please note that this value{" "}
                      <strong> cannot be changed </strong> after your contract
                      has been deployed.
                    </i>
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
                  <FormDescription className="text-center">
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
                  <FormDescription className="text-center">
                    The initial number of votes required to vote on a proposal.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button>Submit</Button>
        <CreateWalletDialog />
      </form>
    </Form>
  );
}
