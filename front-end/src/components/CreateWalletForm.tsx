"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { animated, useTransition } from "@react-spring/web";

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
  // .refine(
  //   (owners) => {
  //     // Check for duplicates
  //     const uniqueOwners = new Set(owners);
  //     return uniqueOwners.size === owners.length;
  //   },
  //   { message: "Duplicate owner addresses are not allowed." }
  // ),
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
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      owners: [],
      requiredMinimumThreshold: "",
      requiredInitialApprovals: "",
      requiredInitialVotes: "",
      name: "",
    },
  });

  const addOwners = () => {
    const currentOwners = form.getValues("owners");

    // Try to parse the input as a JSON array
    try {
      const newOwners = JSON.parse(ownerInput);

      if (Array.isArray(newOwners)) {
        // Validate that all items in the array are valid addresses
        const validOwners = newOwners.filter(
          (owner: string) =>
            owner.length === 42 && ownerInput.substring(0, 2) === "0x"
        );

        if (validOwners.length === newOwners.length) {
          form.setValue("owners", [...currentOwners, ...validOwners]);
          setOwnersArray((prev) => [...prev, ...validOwners]); // Update state with new owners
          setOwnerInput(""); // Clear input field after adding
          console.log("Updated ownersArray:", ownersArray);
          console.log(form.getValues("owners"));
        } else {
          alert("One or more addresses are invalid.");
        }
      } else {
        alert("Input is not a valid array.");
      }
    } catch (error) {
      // If parsing fails, treat the input as a single address
      if (ownerInput.length === 42 && ownerInput.substring(0, 2) === "0x") {
        // write an if statement to check if ownerInput is already in owners Array
        if (ownersArray.includes(ownerInput)) {
          return;
        } else {
          form.setValue("owners", [...currentOwners, ownerInput]);
          setOwnersArray((prev) => [...prev, ownerInput]); // Update state with new owner
          setOwnerInput(""); // Clear input field after adding
          console.log("Updated ownersArray:", ownersArray);
          console.log(form.getValues("owners"));
        }

        form.setValue("owners", [...currentOwners, ownerInput]);
        setOwnersArray((prev) => [...prev, ownerInput]); // Update state with new owner
        setOwnerInput(""); // Clear input field after adding
        console.log("Updated ownersArray:", ownersArray);
        console.log(form.getValues("owners"));
      } else {
        alert("Invalid address length");
      }
    }
  };

  const transitions = useTransition(ownersArray, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(20px)" },
    config: { tension: 170, friction: 20 }, // Duration of the animation in milliseconds
  });

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
                <Button className="w-1/4" onClick={addOwners} type="button">
                  Add Owner(s)
                </Button>
              </div>
              <FormDescription className="text-center self-start">
                Add an owner individually or enter the addresses as an array
                (e.g. ["wallet1", "wallet2", ...]).
              </FormDescription>
              <FormMessage />
            </FormItem>
          </div>
          <div className="w-full h-24 mt-4 overflow-auto">
            {ownersArray.length === 0 ? (
              <p className="text-white">No owners added yet.</p>
            ) : (
              <div className="w-full h-full">
                {transitions((style, owner) => (
                  <animated.div
                    className="inline-block"
                    style={style}
                    key={ownersArray.indexOf(owner)}
                  >
                    <Button
                      className="underline m-2 p-2"
                      variant={"outline"}
                      key={ownersArray.indexOf(owner)}
                    >
                      {owner.substring(0, 6)}...{owner.substring(6, 10)}
                    </Button>
                  </animated.div>
                ))}
              </div>

              // ownersArray.map((owner, index) => (
              //   <div key={index} className="inline-block">
              //     <Button className=" underline m-2 p-2" variant={"outline"}>
              //       {owner.substring(0, 6)}...{owner.substring(6, 10)}
              //     </Button>
              //   </div>
              // ))
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
