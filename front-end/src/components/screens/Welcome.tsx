import React from "react";
import Container from "./Container";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export default function Welcome({
  handleScreenChange,
}: {
  handleScreenChange: (id: number) => void;
}) {
  return (
    <Container>
      <h1 className="font-bold text-4xl "> Welcome </h1>
      <Separator className="w-80" />
      <div className=" w-[800px] text-center mt-8 text-muted-foreground">
        <h2>
          Whether you're looking to create a new multisig wallet or manage an
          existing one, you've come to the right place. Start by setting up a
          secure, collaborative wallet or seamlessly integrate an existing one
          to take control of your assets with confidence.
        </h2>
      </div>
      <Button
        onClick={() => handleScreenChange(1)}
        variant={"outline"}
        className="w-[250px] h-[50px] mt-4 "
      >
        <p>Get Started</p>
      </Button>
    </Container>
  );
}
