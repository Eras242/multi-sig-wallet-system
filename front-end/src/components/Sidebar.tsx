import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  return (
    <div className="hidden w-64 flex flex-col border-r bg-background md:flex z-10 h-full">
      <nav className="flex flex-col space-y-2 px-4 py-6 flex-grow">
        <h1 className="font-semibold mb-4">Stone+ Multisig</h1>
        <div className="w-full flex flex-col gap-2">
          <Button
            variant={"outline"}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
            Add / Create Wallet +
          </Button>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            Wallet 1
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            Wallet 2
          </Link>
        </div>
      </nav>

      {/* // THIS DIV HERE */}
      <div className="flex flex-col gap-2 p-4 mb-8">
        <Button variant="outline">Connect Wallet</Button>
        <Button variant="outline">Settings</Button>
      </div>
    </div>
  );
};
