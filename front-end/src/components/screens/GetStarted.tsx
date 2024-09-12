import React from "react";
import { Button } from "../ui/button";
import Container from "./Container";
import { Separator } from "../ui/separator";

export default function GetStarted({
  handleScreenChange,
}: {
  handleScreenChange: (id: number) => void;
}) {
  return (
    <Container>
      <h2 className="font-bold text-2xl ">
        How would you like to get started?
      </h2>
      <Separator className="w-80" />
      <div className="flex gap-4">
        <Button
          onClick={() => handleScreenChange(2)}
          variant={"outline"}
          className="w-[250px] h-[100px]"
        >
          <p>Add an existing wallet</p>
        </Button>
        <Button
          onClick={() => handleScreenChange(3)}
          variant={"outline"}
          className="w-[250px] h-[100px] "
        >
          <p>Create a new Wallet</p>
        </Button>
      </div>
    </Container>
  );
}
