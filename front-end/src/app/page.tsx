import { WagmiConnectionProvider } from "@/data/providers";

import { Sidebar } from "@/components/Sidebar";
import { Wallet } from "@/components/Wallet";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WelcomeCreateAdd } from "@/components/WelcomeAddCreate";

export default function Home() {
  return (
    <WagmiConnectionProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <WelcomeCreateAdd />

        {/* <Wallet /> */}
      </div>
    </WagmiConnectionProvider>
  );
}

{
  /* <animated.div
style={{ ...transitions }}
key={currentScreen}
className="bg-purple-300"
> */
}
{
  /* {transitions((style, item) => (
<animated.div style={style}>{item.component}</animated.div>
))} */
}
{
  /* </animated.div> */
}
