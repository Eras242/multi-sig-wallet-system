"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ExclamationCircleOutlined } from "@ant-design/icons";

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
                  <FormLabel>Minimum Threshold</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormDescription className="text-center">
                    The minimum number of approvals required to execute a
                    transaction and vote on a proposal within the wallet
                    handler.{" "}
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
        <AlertDialog>
          <AlertDialogTrigger>
            {" "}
            <Button>Create Wallet</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Risk Warning: </AlertDialogTitle>
              <AlertDialogDescription className="flex flex-col gap-4">
                By using this multi-signature smart contract wallet, you
                acknowledge and understand the following risks:
                <p>
                  1. <strong>Safety and Security</strong>: While this
                  multi-signature wallet is designed with security features to
                  protect your digital assets, no system is entirely immune to
                  risks. We recommend that all users exercise caution and ensure
                  they fully understand the functionalities and limitations of
                  smart contracts.{" "}
                </p>
                <p>
                  2. <strong>Associated Risks</strong>: Smart contracts operate
                  on the blockchain and are subject to potential
                  vulnerabilities, including coding errors, bugs, or unforeseen
                  interactions with other contracts. These risks could result in
                  the partial or total loss of assets. Users should be aware
                  that blockchain technology is experimental, and unforeseen
                  issues may arise.
                </p>
                <p>
                  3. <strong>User Responsibility</strong>: It is your
                  responsibility to secure your private keys, understand the
                  multi-signature process, and ensure that all parties involved
                  in the multi-signature process are trustworthy. We do not have
                  control over or access to your private keys, and we cannot
                  recover lost assets.
                </p>
                <p>
                  {" "}
                  4. <strong>No Liability</strong>: We are not liable for any
                  losses, damages, or claims arising from the use of our
                  multi-signature wallet, including but not limited to losses
                  due to security breaches, coding errors, or external attacks.
                  Users agree to use our wallet at their own risk.
                </p>
                <p>
                  {" "}
                  5. <strong>Continuous Development</strong>: The smart contract
                  and associated technology may undergo updates or changes.
                </p>
                It is your responsibility to stay informed about these changes
                and how they may impact your use of the wallet. By proceeding,
                you confirm that you understand these warnings and agree to
                assume the associated risks.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button type="submit">Create Wallet</Button>
      </form>
    </Form>
  );
}
