import React from "react";

import { EditOutlined } from "@ant-design/icons";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Copy } from "lucide-react";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import { SubmitTransaction } from "@/components/SubmitTransaction";
import { Transactions } from "@/components/Transactions";

export const Wallet = () => {
  return (
    <div className=" flex flex-1 flex-col px-8 py-8 gap-4">
      <div className="flex items-center h-12  gap-4 mb-8">
        <h1 className="font-bold text-4xl ">DAO Wallet 1 </h1>
        <Card className="px-4 py-2">
          <p className="muted flex gap-2 text-sm">
            0x0C59...7B2D{" "}
            <span className="flex items-center justify-center">
              {<Copy size={16} />}
            </span>
          </p>
        </Card>

        {/* <Button variant="outline" className="ml-auto">
        Connect Wallet
      </Button> */}
        <div className="ml-auto">
          <ConnectWallet />
        </div>
        <Switch />
        <p>Light</p>
      </div>

      <div className="flex flex-1 flex-row  w-full gap-4">
        <Card className="h-[200px] w-[400px]">
          <CardHeader>
            <CardTitle>Total ETH Balance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-left">
            <div className="text-4xl font-bold">$9,341.31</div>
            <div className="text-2xl font-semibold text-muted-foreground mb-4">
              Ξ 3.2379
            </div>
            <span className="text-sm text-muted-foreground font-mono ">
              Last updated 2 minutes ago
            </span>
          </CardContent>
        </Card>
        <Card className=" flex  border-none shadow-none">
          <CardContent className=" flex items-start justify-endh-full flex-col gap-2">
            <Button variant="outline" className="h-8 cursor-auto">
              5 Owners
            </Button>
            <Button variant="outline" className="h-8 cursor-auto">
              3 Minimum Required Approvals
            </Button>
            <Button variant="outline" className="h-8 cursor-auto">
              Created on: 2023-04-15
            </Button>
            <Separator />
            <Button className="h-8"> Manage Wallet {<EditOutlined />}</Button>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-row">
        <div className="mt-4 flex flex-row gap-4  w-full">
          <Card className="w-2/4">
            {" "}
            <CardHeader>
              <CardTitle>Submit Transaction</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-left">
              <SubmitTransaction />
            </CardContent>
          </Card>
          <Transactions />
        </div>
      </div>
    </div>
  );
};
