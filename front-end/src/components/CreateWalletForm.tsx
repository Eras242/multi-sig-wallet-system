"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeftOutlined } from "@ant-design/icons";
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
  owners: z
    .array(
      z
        .string()
        .min(42, { message: "Owner address must be 42 characters long." })
    )
    .min(1, { message: "At least one owner address is required." }),
  requiredMinimumThreshold: z
    .string()
    // .transform((v) => parseInt(v, 10))
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

type FormData = z.infer<typeof formSchema>;

export function CreateWalletForm({
  setCurrentScreen,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [ownerInput, setOwnerInput] = useState<string>("");
  const [ownersArray, setOwnersArray] = useState<string[]>([]);

  useEffect(() => {}, [ownersArray]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      owners: [],
      requiredMinimumThreshold: "",
      requiredInitialApprovals: "",
      requiredInitialVotes: "",
      name: "",
    },
  });

  const addSingleOwner = () => {
    try {
      // Validate the single address using zod
      const ownerSchema = z
        .string()
        .min(42, { message: "Owner address must be 42 characters long." });

      ownerSchema.parse(ownerInput); // This will throw an error if invalid

      const currentOwners = form.getValues("owners");
      form.setValue("owners", [...currentOwners, ownerInput]);
      setOwnerInput(""); // Clear input field after adding
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors[0].message);
      } else {
        alert("Invalid owner address.");
      }
    }
  };

  const addOwnersArray = () => {
    try {
      const newOwners = JSON.parse(ownerInput);

      // Validate the array of addresses using zod
      formSchema.shape.owners.parse(newOwners); // This will throw an error if invalid

      const currentOwners = form.getValues("owners");
      form.setValue("owners", [...currentOwners, ...newOwners]);
      setOwnerInput(""); // Clear input field after adding
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors[0].message);
      } else if (error instanceof SyntaxError) {
        alert("Invalid JSON format for array input.");
      } else {
        alert("Invalid input.");
      }
    }
  };

  const handleSubmit = (data: any) => {
    console.log("submitted form data:", data);
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
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
                    className="h-24  border-none border-transparent focus:border-transparent focus:ring-0  radius-md text-6xl font-semibold p-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="h-auto mt-12">
          <div className="w-full">
            <FormItem className="flex flex-col">
              <FormLabel>Owners</FormLabel>
              <div className="flex row gap-8 w-full">
                <FormControl>
                  <Input
                    value={ownerInput}
                    onChange={(e) => setOwnerInput(e.target.value)}
                    placeholder="0xABC123... or [0xABC123..., 0xDEF456...]"
                  />
                </FormControl>
                <Button className="w-1/4" onClick={addSingleOwner}>
                  Add Owner
                </Button>
                <Button className="w-1/4" onClick={addOwnersArray}>
                  Add Owners
                </Button>
              </div>
              <FormDescription className="text-center self-start">
                Add an owner individually or enter the addresses as an array
                (e.g. ["wallet1", "wallet2", ...]).
              </FormDescription>
              <FormMessage name="owners" />
            </FormItem>
          </div>
          <div className="w-full h-24 bg-blue-500 mt-4 overflow-auto">
            {ownersArray.length === 0 ? (
              <p className="text-white">No owners added yet.</p>
            ) : (
              ownersArray.map((owner, index) => (
                <div
                  key={index}
                  className="inline-block m-2 p-2 bg-white text-black rounded shadow"
                >
                  <Button className="w-full h-full">{owner}</Button>
                </div>
              ))
            )}
          </div>

          <div className=" flex flex-row gap-8 justify-evenly mt-12">
            <FormField
              control={form.control}
              name="requiredMinimumThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Requried Approvals</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="..." {...field} />
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
                    <Input type="number" placeholder="..." {...field} />
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
                    <Input type="number" placeholder="..." {...field} />
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

        <CreateWalletDialog setCurrentScreen={setCurrentScreen} form={form} />
      </form>
    </Form>
  );
}
