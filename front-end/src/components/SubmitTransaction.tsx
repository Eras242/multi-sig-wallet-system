"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const rawFormSchema = z.object({
  to: z.string().min(2).max(50),
  value: z.string().min(1).max(50),
  data: z.string().min(1).max(50),
});
const erc20FormSchema = z.object({
  to: z.string().min(2).max(50),
  tokenAddress: z.string().min(2).max(50),
  value: z.string().min(1).max(50),
  data: z.string().min(1).max(50),
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
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="w-full flex">
        <TabsTrigger value="raw">Raw</TabsTrigger>
        <TabsTrigger value="erc20">ERC20</TabsTrigger>
      </TabsList>
      <TabsContent value="raw">
        <Form {...rawForm}>
          <form onSubmit={rawForm.handleSubmit(onSubmit)} className="space-y-8">
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
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Value (ETH)" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input placeholder="Data" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Transaction</Button>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="erc20">
        <Form {...erc20Form}>
          <form
            onSubmit={erc20Form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
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
                  <FormLabel>Token Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0xFAs3" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="0.0" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input placeholder="0x000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Transaction</Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};
