import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  return (
    <div className=" hidden w-64 flex-col border-r bg-background md:flex z-10">
      <nav
        className="flex flex-col flex-1 space-y-2 px-4 py-6
  "
      >
        <h1 className="font-semibold">Stone+ Multisig</h1>
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
        <Button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground">
          Add / Create Wallet +
        </Button>
        <div className="flex flex-col">
          <Button variant="outline" className="mt-auto">
            Connect Wallet
          </Button>
          <Button variant="outline" className="mt-auto">
            Settings
          </Button>
        </div>
      </nav>
    </div>
  );
};
