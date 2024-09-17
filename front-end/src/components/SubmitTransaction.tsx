"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Separator } from "./ui/separator";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const rawFormSchema = z.object({
  to: z
    .string()
    .length(42, { message: "Invalid Ethereum address" })
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Address must be a valid Ethereum address",
    }),
  value: z
    .string()
    .min(0, { message: "Value is required" })
    .regex(/^\d+(\.\d+)?$/, { message: "Value must be a valid number" }),
  data: z.string().optional(),
});
const erc20FormSchema = z.object({
  to: z
    .string()
    .length(42, { message: "Invalid Ethereum address" })
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Address must be a valid Ethereum address",
    }),
  tokenAddress: z
    .string()
    .length(42, { message: "Invalid Ethereum address" })
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Address must be a valid Ethereum token address",
    }),
  value: z
    .string()
    .min(0, { message: "Value is required" })
    .regex(/^\d+(\.\d+)?$/, { message: "Value must be a valid number" }),
  data: z.string().optional(),
});

export const SubmitTransaction = () => {
  const rawForm = useForm<z.infer<typeof rawFormSchema>>({
    resolver: zodResolver(rawFormSchema),
    defaultValues: {
      to: "",
      value: "",
      data: "",
    },
  });
  const erc20Form = useForm<z.infer<typeof erc20FormSchema>>({
    resolver: zodResolver(erc20FormSchema),
    defaultValues: {
      to: "",
      tokenAddress: "",
      value: "",
      data: "",
    },
  });

  function onSubmit(
    values: z.infer<typeof erc20FormSchema | typeof rawFormSchema>
  ) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Tabs defaultValue="raw" className="w-full">
      <TabsList className="w-full flex">
        <TabsTrigger value="raw">Raw</TabsTrigger>
        <TabsTrigger value="erc20">ERC20</TabsTrigger>
      </TabsList>
      <TabsContent value="raw">
        <Form {...rawForm}>
          <form onSubmit={rawForm.handleSubmit(onSubmit)} className="space-y-8">
            {/* To Field */}
            <FormField
              control={rawForm.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input placeholder="Recipient Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Value Field */}
            <FormField
              control={rawForm.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Value (ETH)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data Field */}
            <FormField
              control={rawForm.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input placeholder="Data" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Dialog>
              <DialogTrigger>Submit Transaction</DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Transaction</DialogTitle>
                    <DialogDescription className="flex flex-col gap-4 flex-wrap">
                      <p>
                        This transaction will send funds to or interact with a
                        smart contract at the specified address.
                      </p>
                      <Separator />

                      <div className="flex flex-row gap-2 items-center ">
                        <h1>Address: </h1>
                        <Button
                          variant="outline"
                          className="h-8 cursor-auto ml-auto"
                        >
                          0xe1e0181499b5dEAd487d464B7CdF91652d669577
                        </Button>
                      </div>
                      <div className="flex flex-row gap-2 items-center ">
                        <h1>Value: </h1>
                        <Button
                          variant="outline"
                          className="h-8 cursor-auto ml-auto"
                        >
                          12.33 Ξ
                        </Button>
                      </div>
                      <div className="flex flex-row gap-2 items-center ">
                        <h1>Data: </h1>
                        <Button
                          variant="outline"
                          className="h-8 cursor-auto ml-auto"
                        >
                          0x0
                        </Button>
                      </div>
                      <Separator />
                      <p>
                        Please ensure you have the necessary permissions and
                        funds to complete this transaction.
                      </p>

                      <Button>Submit Transaction</Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="erc20">
        <Form {...erc20Form}>
          <form
            onSubmit={erc20Form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* To Address Field */}
            <FormField
              control={erc20Form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input placeholder="0xFAs3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Token Address Field */}
            <FormField
              control={erc20Form.control}
              name="tokenAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0xFAs3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Value Field */}
            <FormField
              control={erc20Form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="0.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data Field */}
            <FormField
              control={erc20Form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input placeholder="0x000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Dialog>
              <DialogTrigger>Submit Transaction</DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Transaction</DialogTitle>
                    <DialogDescription className="flex flex-col gap-4 flex-wrap">
                      <p>
                        This transaction will send ERC20 tokens to or interact with a
                        smart contract at the specified "To" address.
                      </p>
                      <Separator />

                      <div className="flex flex-row gap-2 items-center ">
                        <h1>To: </h1>
                        <Button
                          variant="outline"
                          className="h-8 cursor-auto ml-auto"
                        >
                          0xe1e0181499b5dEAd487d464B7CdF91652d669577
                        </Button>
                      </div>
                      <div className="flex flex-row gap-2 items-center ">
                        <h1>Token: </h1>
                        <Button
                          variant="outline"
                          className="h-8 cursor-auto ml-auto"
                        >
                          0xe1e0181499b5dEAd487d464B7CdF91652d669577
                        </Button>
                      </div>
                      <div className="flex flex-row gap-2 items-center ">
                        <h1>Value: </h1>
                        <Button
                          variant="outline"
                          className="h-8 cursor-auto ml-auto"
                        >
                          12.33
                        </Button>
                      </div>
                      <div className="flex flex-row gap-2 items-center ">
                        <h1>Data: </h1>
                        <Button
                          variant="outline"
                          className="h-8 cursor-auto ml-auto"
                        >
                          0x0
                        </Button>
                      </div>
                      <Separator />
                      <p>
                        Please ensure you have the necessary permissions and
                        funds to complete this transaction.
                      </p>

                      <Button>Submit Transaction</Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};
