"use client";
import { useEffect, useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { abi } from "@/abi/Box";
import Welcome from "./screens/Welcome";
import GetStarted from "./screens/GetStarted";
import AddWallet from "./screens/AddWallet";
import CreateWallet from "./screens/CreateWallet";
import DeployingWallet from "./screens/DeployingWallet";

export const WelcomeCreateAdd = () => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: hash,
    error,
    isPending,
    writeContractAsync,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const [currentScreen, setCurrentScreen] = useState(0);

  // useEffect(() => {
  //   const slug = pathname.split("/")[1]; // Get the slug from the URL (default to 'welcome')
  //   const screenIndex = slugToScreen[slug]; // Get the screen index
  //   if (screenIndex !== undefined) {
  //     setCurrentScreen(screenIndex);
  //   }
  // }, [pathname]);

  const sendCreateWalletTransaction = async (
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
  ) => {
    const {
      owners,
      requiredMinimumThreshold,
      requiredInitialApprovals,
      requiredInitialVotes,
      name,
    } = form.getValues();

    const toEthereumAddressArray = (addresses: string[]): `0x${string}`[] => {
      return addresses.map((address) => {
        if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
          return address as `0x${string}`;
        } else {
          throw new Error(`Invalid Ethereum address: ${address}`);
        }
      });
    };

    const formattedOwners = toEthereumAddressArray(owners);

    try {
      await writeContractAsync({
        address: "0x0C59767bA47eFEfFEd4e219Ca0F8C4EeD2857B2D",
        abi,
        functionName: "setNumber",
        args: [BigInt(1)],
        // [
        //   formattedOwners, // _owners
        //   BigInt(requiredMinimumThreshold), // _requiredMinimumThreshold (example value)
        //   BigInt(requiredInitialApprovals), // _requiredInitialApprovals (example value)
        //   BigInt(requiredInitialVotes), // _requiredInitialVotes (example value)
        //   name, // _name
        // ],
      });
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  useEffect(() => {
    console.log("Transaction Hash: ", hash);
  }, [hash]);

  const handleScreenChange = (id: number) => {
    setCurrentScreen(id);
    // const slug = screens.find((screen) => screen.id === id)?.name;
    // if (slug) {

    //   router.push(`/${slug}`);
    // }
  };

  const screens = [
    {
      id: 0,
      name: "welcome",
      component: (
        <Welcome handleScreenChange={handleScreenChange} key="welcome" />
      ),
    },
    {
      id: 1,
      name: "getting-started",
      component: (
        <GetStarted handleScreenChange={handleScreenChange} key="getStarted" />
      ),
    },
    {
      id: 2,
      name: "add-wallet",
      component: (
        <AddWallet handleScreenChange={handleScreenChange} key="addWallet" />
      ),
    },
    {
      id: 3,
      name: "create-wallet",
      component: (
        <CreateWallet
          handleScreenChange={handleScreenChange}
          sendCreateWalletTransaction={sendCreateWalletTransaction}
          key="createWallet"
        />
      ),
    },
    {
      id: 4,
      name: "deploying",
      component: (
        <DeployingWallet
          hash={hash}
          error={error}
          isPending={isPending}
          isConfirming={isConfirming}
          isConfirmed={isConfirmed}
          key="deployingWallet"
        />
      ),
    },
  ];

  const transitions = useTransition(screens[currentScreen], {
    from: { opacity: 0, transform: "translateX(100%)" },
    enter: { opacity: 1, transform: "translateX(0%)" },
    leave: { opacity: 0, transform: "translateX(-100%)" },
    config: { tension: 220, friction: 30 },
    reverse: true, // Makes the transition reverse when the screen changes
    keys: currentScreen, // Helps to identify when a transition should occur based on screen change
  });

  return (
    <>
      {transitions((style, item) => (
        <div className=" absolute left-2/4 top-2/4 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden w-full px-8 py-8 gap-4 border-box">
          <animated.div
            style={style}
            className="flex items-center justify-center"
          >
            {item.component}
          </animated.div>
        </div>
      ))}
    </>
  );
};
