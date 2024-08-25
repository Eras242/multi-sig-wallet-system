export const abi = [
  {
    type: "function",
    name: "createMultiSigWalletAndHandler",
    inputs: [
      {
        name: "_owners",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_requiredMinimumThreshold",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_requiredInitialApprovals",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_requiredInitialVotes",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_name",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [
      {
        name: "wallet",
        type: "address",
        internalType: "contract MultiSigWallet",
      },
      {
        name: "handler",
        type: "address",
        internalType: "contract MultiSigHandler",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "MultiSigWalletAndHandlerCreated",
    inputs: [
      {
        name: "initializer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "wallet",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "handler",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
] as const;
