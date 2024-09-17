import React, { useState, useEffect } from "react";
import Container from "./Container";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WriteContractErrorType, type BaseError } from "@wagmi/core";
import { useSpring, animated } from "@react-spring/web";

import { useWaitForTransactionReceipt } from "wagmi";

export default function DeployingWallet({
  error,
  isPending,
  isConfirming,
  isConfirmed,
  hash,
}: {
  error: WriteContractErrorType | null;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  hash: `0x${string}` | undefined;
}) {
  const [percentage, setPercentage] = useState(0);
  const [showWallet, setShowWallet] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isPending) {
      setPercentage(0);
    } else if (isConfirming) {
      setPercentage(50);
      toast("Transaction pending, please wait...");
    } else if (isConfirmed) {
      // set a timeout to show the wallet after the transaction is confirmed
      setPercentage(100);
      toast("Transaction confirmed - Wallet created!");
      setShowWallet(true);
      setTimeout(() => {
        router.push("/0x0C59767bA47eFEfFEd4e219Ca0F8C4EeD2857B2D");
      }, 3000);
    } else if (error) {
      toast.error((error as BaseError).shortMessage || error.message);
    }
  }, [isPending, isConfirming, isConfirmed, hash]);

  const { opacity } = useSpring({
    opacity: error || isPending || isConfirming || isConfirmed ? 1 : 0,
    config: { duration: 500 }, // Animation duration in milliseconds
  });

  return (
    <Container>
      <>
        {" "}
        <h2 className="font-bold text-2xl ">Deploying your new wallet</h2>
        <Separator className="w-80" />
        <animated.p style={{ opacity }} className="mt-8">
          {error && (
            <div>{(error as BaseError).shortMessage || error.message}</div>
          )}
          {isPending && "Please confirm the transaction..."}
          {isConfirming && "Awaiting transaction confirmation..."}
          {isConfirmed && "Wallet Created - Fetching Wallet ..."}
        </animated.p>
        <Progress value={percentage} className=" h-2 w-[500px] mb-8" />
        {hash && (
          <div className="flex items-center space-x-2 text-xs border py-2 px-12 rounded">
            <p>TX Hash: </p>
            <span className="underline">
              {hash.substring(0, 7)}...{hash.substring(-4, 0)}
            </span>
          </div>
        )}
      </>
    </Container>
  );
}
