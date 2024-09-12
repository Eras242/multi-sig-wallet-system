import React, { useState, useEffect } from "react";
import Container from "./Container";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { useWaitForTransactionReceipt } from "wagmi";

export default function DeployingWallet({
  isPending,
  isConfirming,
  isConfirmed,
  hash,
}: {
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
    } else if (isConfirmed) {
      // set a timeout to show the wallet after the transaction is confirmed
      setPercentage(100);
      setShowWallet(true);
      setTimeout(() => {
        router.push("/0x0C59767bA47eFEfFEd4e219Ca0F8C4EeD2857B2D");
      }, 3000);
    }
  }, [isPending, isConfirming, isConfirmed, hash]);

  return (
    <Container>
      {showWallet ? (
        <p>Wallet Ready</p>
      ) : (
        <>
          {" "}
          <h2 className="font-bold text-2xl ">Deploying your new wallet:</h2>
          <Separator className="w-80" />
          <p>
            {isPending && "Please confirm the transaction..."}
            {isConfirming && "Awaiting transaction confirmation..."}
            {isConfirmed && "Transaction confirmed!"}
          </p>
          <Progress value={percentage} className=" h-2 w-[500px] my-16" />
          {hash && (
            <div className="flex items-center space-x-2 text-xs border py-2 px-12 rounded">
              <p>TX Hash: </p>
              <span className="underline">0x1cd...a2ae</span>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
