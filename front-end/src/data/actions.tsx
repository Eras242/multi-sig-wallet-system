import { useWriteContract } from "wagmi";
import { UseFormReturn } from "react-hook-form";
import { abi } from "@/abi/MultiSigFactory";
import { ethers } from "ethers";

export async function createMultiSigWallet(
  form: UseFormReturn<
    {
      owners: string[];
      requiredMinimumThreshold: number;
      requiredInitialApprovals: number;
      requiredInitialVotes: number;
      name: string;
    },
    any,
    undefined
  >
) {
  const { data: hash, writeContract } = useWriteContract();

  writeContract({
    address: "0x",
    abi,
    functionName: "createMultiSig",
    args: [
      ["0xAddress1", "0xAddress2"], // _owners
      1, // _requiredMinimumThreshold (example value)
      2, // _requiredInitialApprovals (example value)
      3, // _requiredInitialVotes (example value)
      "MyMultiSigWallet", // _name
    ],
  });

  return;
}
