"use client";
import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { ArrowLeftOutlined } from "@ant-design/icons";

import React from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const WelcomeCreateAdd = () => {
  const Welcome = () => {
    return (
      <animated.div className="relative flex items-center justify-center flex-col px-8 py-8 gap-4 w-full ">
        <h1 className="font-bold text-4xl "> Welcome </h1>
        <Separator className="w-80" />
        <div className=" w-[800px] text-center mt-8">
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
      </animated.div>
    );
  };
  const GetStarted = () => {
    return (
      <animated.div className="relative flex items-center justify-center flex-col px-8 py-8 gap-4 w-full">
        <h2 className="font-bold text-2xl ">
          How would you like to get started?
        </h2>
        <Separator className="w-80" />
        <div className=" w-[800px] text-center "></div>
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
      </animated.div>
    );
  };
  const AddWallet = () => {
    return (
      <animated.div className="relative flex items-center justify-center flex-col px-8 py-8 gap-4 w-full ">
        <h2 className="font-bold text-2xl ">Access an existing wallet:</h2>
        <Separator className="w-80" />
        <Input className="w-[300px] h-[50px]" placeholder={"Wallet Address"} />
        <div className="flex gap-2">
          <Button variant={"outline"}>
            {" "}
            <ArrowLeftOutlined />
            Back
          </Button>
          <Button variant={"outline"}>View Wallet</Button>
        </div>
      </animated.div>
    );
  };
  const CreateWallet = () => {
    return (
      <animated.div className="relative flex items-center justify-center flex-col px-8 py-8 gap-4 w-full bg-green-200">
        <h1>Create Wallet</h1>
      </animated.div>
    );
  };

  const [currentScreen, setCurrentScreen] = useState(0);

  const transitions = useSpring({
    opacity: currentScreen === 0 ? 1 : 1,
    transform: currentScreen === 0 ? "translateX(0%)" : "translateX(0%)",
    from:
      currentScreen === 0
        ? { opacity: 1, transform: "translateX(0%)" }
        : { opacity: 0, transform: "translateX(100%)" },
    reset: true,
    // key: currentScreen,
  });

  const screens = [
    <Welcome key="welcome" />,
    <GetStarted key="getStarted" />,
    <AddWallet key="addWallet" />,
    <CreateWallet key="createWallet" />,
  ];

  return (
    <div className="flex items-center w-full overflow-hidden">
      <animated.div style={transitions} key={currentScreen} className="w-full">
        {screens[currentScreen]}
      </animated.div>
    </div>
  );
};
