"use client";

import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { UseFormReturn } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogFooter,
} from "@/components/ui/dialog";

import { Separator } from "./ui/separator";

import { Button } from "@/components/ui/button";

export const CreateWalletDialog = ({
  setCurrentScreen,
  form,
}: {
  setCurrentScreen: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturn<
    {
      owners: string[];
      requiredMinimumThreshold: string;
      requiredInitialApprovals: string;
      requiredInitialVotes: string;
      name: string;
    },
    any,
    undefined
  >;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const goToNextStep = () => setCurrentStep(2);

  const transitions = useSpring({
    opacity: currentStep === 1 ? 1 : 0,
    transform: currentStep === 1 ? "translateX(0%)" : "translateX(-100%)",
    config: { tension: 250, friction: 30 },
  });

  const transitionsNext = useSpring({
    opacity: currentStep === 2 ? 1 : 0,
    transform: currentStep === 2 ? "translateX(0%)" : "translateX(100%)",
    config: { tension: 250, friction: 30 },
  });
  return (
    <Dialog>
      <DialogTrigger
        asChild
        disabled={!form.formState.isValid || form.formState.isSubmitting}
      >
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Create Wallet
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        {/* Animated DialogContent */}
        {currentStep === 1 && (
          <animated.div style={transitions}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Risk Warning</DialogTitle>
                <DialogDescription className="flex flex-col gap-4">
                  By deploying and using this multi-signature smart contract
                  wallet, you acknowledge and understand the following risks:
                  <p>
                    1. <strong>Safety and Security</strong>: While this
                    multi-signature wallet is designed with security features to
                    protect your digital assets, no system is entirely immune to
                    risks. We recommend that all users exercise caution and
                    ensure they fully understand the functionalities and
                    limitations of smart contracts.{" "}
                  </p>
                  <p>
                    2. <strong>Associated Risks</strong>: Smart contracts
                    operate on the blockchain and are subject to potential
                    vulnerabilities, including coding errors, bugs, or
                    unforeseen interactions with other contracts. These risks
                    could result in the partial or total loss of assets. Users
                    should be aware that blockchain technology is experimental,
                    and unforeseen issues may arise.
                  </p>
                  <p>
                    3. <strong>User Responsibility</strong>: It is your
                    responsibility to secure your private keys, understand the
                    multi-signature process, and ensure that all parties
                    involved in the multi-signature process are trustworthy. We
                    do not have control over or access to your private keys, and
                    we cannot recover lost assets.
                  </p>
                  <p>
                    {" "}
                    4. <strong>No Liability</strong>: We are not liable for any
                    losses, damages, or claims arising from the use of our
                    multi-signature wallet, including but not limited to losses
                    due to security breaches, coding errors, or external
                    attacks. Users agree to use our wallet at their own risk.
                  </p>
                  <p>
                    {" "}
                    5. <strong>Continuous Development</strong>: The smart
                    contract and associated technology may undergo updates or
                    changes.
                  </p>
                  It is your responsibility to stay informed about these changes
                  and how they may impact your use of the wallet. By proceeding,
                  you confirm that you understand these warnings and agree to
                  assume the associated risks.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="default" onClick={goToNextStep}>
                  Continue
                </Button>
              </DialogFooter>{" "}
            </DialogContent>
          </animated.div>
        )}
        {currentStep === 2 && (
          <animated.div style={transitionsNext}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-4">Create Wallet</DialogTitle>
                <DialogDescription className="flex flex-col gap-4 flex-wrap ">
                  <div className="flex flex-row gap-2 items-center ">
                    <h1>Wallet Name: </h1>
                    <Button
                      variant="outline"
                      className="h-8 cursor-auto ml-auto"
                    >
                      {form && form.getValues("name")}
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex flex-row gap-2 items-center w-full flex-wrap">
                    <h1>Initial Owners: </h1>
                    <div className="flex gap-2 w-full flex-wrap">
                      {form &&
                        form.getValues("owners").map((owner, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="h-8 cursor-auto underline underline-offset-2"
                          >
                            {owner.substring(0, 6)}...{owner.substring(6, 10)}
                          </Button>
                        ))}
                    </div>
                  </div>

                  <Separator />
                  <div className="flex flex-row gap-2 items-center ">
                    <h1>Minimum Required Approvals: </h1>
                    <Button
                      variant="default"
                      className="h-8 cursor-auto ml-auto"
                    >
                      {form && form.getValues("requiredMinimumThreshold")}
                    </Button>
                  </div>
                  <div className="flex flex-row gap-2 items-center  ">
                    <h1>Initial Approvals: </h1>
                    <Button
                      variant="outline"
                      className="h-8 cursor-automl-auto ml-auto"
                    >
                      {form && form.getValues("requiredInitialApprovals")}
                    </Button>
                  </div>
                  <div className="flex flex-row gap-2 items-center ">
                    <h1>Initial Votes: </h1>
                    <Button
                      variant="outline"
                      className="h-8 cursor-auto ml-auto"
                    >
                      {form && form.getValues("requiredInitialVotes")}
                    </Button>
                  </div>
                  <Separator />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant={"outline"} className="flex gap-4">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={() => setCurrentScreen(4)}>
                    Create Wallet
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </animated.div>
        )}
      </DialogPortal>
    </Dialog>
  );
};

/* <DialogHeader>
<DialogTitle>Risk Warning</DialogTitle>
<DialogDescription className="flex flex-col gap-4">
  By deploying and using this multi-signature smart contract
  wallet, you acknowledge and understand the following risks:
  <p>
    1. <strong>Safety and Security</strong>: While this
    multi-signature wallet is designed with security features to
    protect your digital assets, no system is entirely immune to
    risks. We recommend that all users exercise caution and
    ensure they fully understand the functionalities and
    limitations of smart contracts.{" "}
  </p>
  <p>
    2. <strong>Associated Risks</strong>: Smart contracts
    operate on the blockchain and are subject to potential
    vulnerabilities, including coding errors, bugs, or
    unforeseen interactions with other contracts. These risks
    could result in the partial or total loss of assets. Users
    should be aware that blockchain technology is experimental,
    and unforeseen issues may arise.
  </p>
  <p>
    3. <strong>User Responsibility</strong>: It is your
    responsibility to secure your private keys, understand the
    multi-signature process, and ensure that all parties
    involved in the multi-signature process are trustworthy. We
    do not have control over or access to your private keys, and
    we cannot recover lost assets.
  </p>
  <p>
    {" "}
    4. <strong>No Liability</strong>: We are not liable for any
    losses, damages, or claims arising from the use of our
    multi-signature wallet, including but not limited to losses
    due to security breaches, coding errors, or external
    attacks. Users agree to use our wallet at their own risk.
  </p>
  <p>
    {" "}
    5. <strong>Continuous Development</strong>: The smart
    contract and associated technology may undergo updates or
    changes.
  </p>
  It is your responsibility to stay informed about these changes
  and how they may impact your use of the wallet. By proceeding,
  you confirm that you understand these warnings and agree to
  assume the associated risks.
</DialogDescription>
</DialogHeader>
<DialogFooter>
<Button variant="default" onClick={goToNextStep}>
  Continue
</Button>
</DialogFooter> */
