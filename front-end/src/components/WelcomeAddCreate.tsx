"use client";
import { useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CreateWalletForm } from "./CreateWalletForm";
import React from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const WelcomeCreateAdd = () => {
  const Container = ({ children }: { children: React.ReactNode }) => {
    return (
      <animated.div className="flex items-center justify-center flex-col px-8 py-8 gap-4 border-box">
        {children}
      </animated.div>
    );
  };

  const Welcome = () => {
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
          onClick={() => setCurrentScreen(1)}
          variant={"outline"}
          className="w-[250px] h-[50px] mt-4 "
        >
          <p>Get Started</p>
        </Button>
      </Container>
    );
  };
  const GetStarted = () => {
    return (
      <Container>
        <h2 className="font-bold text-2xl ">
          How would you like to get started?
        </h2>
        <Separator className="w-80" />
        <div className="flex gap-4">
          <Button
            onClick={() => setCurrentScreen(2)}
            variant={"outline"}
            className="w-[250px] h-[100px]"
          >
            <p>Add an existing wallet</p>
          </Button>
          <Button
            onClick={() => setCurrentScreen(3)}
            variant={"outline"}
            className="w-[250px] h-[100px] "
          >
            <p>Create a new Wallet</p>
          </Button>
        </div>
      </Container>
    );
  };
  const AddWallet = () => {
    return (
      <Container>
        <h2 className="font-bold text-2xl ">
          Add and view an existing wallet:
        </h2>
        <Separator className="w-80" />
        <Input className="w-[300px] h-[50px]" placeholder={"Wallet Address"} />
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            className="flex gap-4"
            onClick={() => setCurrentScreen(1)}
          >
            {" "}
            <ArrowLeftOutlined />
            Back
          </Button>
          <Button variant={"outline"}>View Wallet</Button>
        </div>
      </Container>
    );
  };
  const CreateWallet = () => {
    return (
      <Container>
        <CreateWalletForm />
        <Button
          variant={"outline"}
          className="flex gap-4"
          onClick={() => setCurrentScreen(1)}
        >
          <ArrowLeftOutlined />
          Back
        </Button>
      </Container>
    );
  };

  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    { id: 0, component: <Welcome key="welcome" /> },
    { id: 1, component: <GetStarted key="getStarted" /> },
    { id: 2, component: <AddWallet key="addWallet" /> },
    { id: 3, component: <CreateWallet key="createWallet" /> },
  ];

  const transitions = useTransition(screens[currentScreen], {
    from: { opacity: 0, transform: "translateX(200%)" },
    enter: { opacity: 1, transform: "translateX(0%)" },
    leave: { opacity: 0, transform: "translateX(-100%)" },
    config: { tension: 220, friction: 30 },
    reverse: true, // Makes the transition reverse when the screen changes
    keys: currentScreen, // Helps to identify when a transition should occur based on screen change
  });

  return (
    // <div className=" flex h-full w-full overflow-hidden bg-green-300">
    <div className="relative w-full h-full overflow-hidden self-center ">
      {/* <animated.div
        style={{ ...transitions }}
        key={currentScreen}
        className="bg-purple-300"
      > */}
      {transitions((style, item) => (
        <div className="absolute left-2/4 top-2/4 transform -translate-x-1/2 -translate-y-1/2 px-8 py-8 gap-4 border-box">
          <animated.div
            style={style}
            className="flex items-center justify-center"
          >
            {item.component}
          </animated.div>
        </div>
      ))}
      {/* </animated.div> */}

      {/* <p>Hello World</p> */}
    </div>
  );
};
