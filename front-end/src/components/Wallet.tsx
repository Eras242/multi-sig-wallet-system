import React from "react";

import { EditOutlined } from "@ant-design/icons";
import { ConnectWallet } from "@/components/ConnectWallet";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import { SubmitTransaction } from "@/components/SubmitTransaction";
import { Transactions } from "@/components/Transactions";

export const Wallet = () => {
  return (
    <div className=" flex flex-1 flex-col px-8 py-8 gap-4">
      <div className="flex items-center h-12  gap-4">
        <h1 className="font-bold text-4xl ">DAO Wallet 1 </h1>

        {/* <Button variant="outline" className="ml-auto">
        Connect Wallet
      </Button> */}
        <ConnectWallet />
        <Switch />
        <p>Light</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Card className="">
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
        <Card className=" flex items-end h-full border-none shadow-none">
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
        {/* <Card className=" h-full">
      <CardHeader>
        <CardTitle>Token balances</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Token</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Amount ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">WBTC</TableCell>
              <TableCell>0.03</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">WBTC</TableCell>
              <TableCell>0.03</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">WBTC</TableCell>
              <TableCell>0.03</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card> */}

        {/* <Card className=" h-full">
      <CardContent className="flex items-center justify-center flex-col items-left h-full">
        <h3>Add Currency to Track</h3>
        <p>+</p>
      </CardContent>
    </Card> */}
      </div>

      <div className="mt-4 grid grid-cols-2 col-span-2 gap-4 ">
        {/* <h1>Transactions</h1> */}
        <Card>
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
  );
};
