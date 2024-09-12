import React from "react";
import Container from "./Container";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Separator } from "../ui/separator";

export default function AddWallet({
  handleScreenChange,
}: {
  handleScreenChange: (id: number) => void;
}) {
  return (
    <Container>
      <h2 className="font-bold text-2xl ">Add and view an existing wallet:</h2>
      <Separator className="w-80" />
      <Input className="w-[300px] h-[50px]" placeholder={"Wallet Address"} />
      <div className="flex gap-2">
        <Button
          variant={"outline"}
          className="flex gap-4"
          onClick={() => handleScreenChange(1)}
        >
          {" "}
          <ArrowLeftOutlined />
          Back
        </Button>
        <Button variant={"outline"}>View Wallet</Button>
      </div>
    </Container>
  );
}
