import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CreateWalletForm } from "../CreateWalletForm";
import { Button } from "../ui/button";
import Container from "./Container";
import { UseFormReturn } from "react-hook-form";

export default function CreateWallet({
  sendCreateWalletTransaction,
  handleScreenChange,
}: {
  sendCreateWalletTransaction: (
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
  ) => Promise<void>;
  handleScreenChange: (id: number) => void;
}) {
  return (
    <Container>
      <CreateWalletForm
        handleScreenChange={handleScreenChange}
        sendCreateWalletTransaction={sendCreateWalletTransaction}
      />
      <Button
        variant={"outline"}
        className="flex gap-4"
        onClick={() => handleScreenChange(1)}
      >
        <ArrowLeftOutlined />
        Back
      </Button>
    </Container>
  );
}
