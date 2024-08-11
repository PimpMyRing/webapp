import { createLightAccountClient } from "@alchemy/aa-accounts";
import { base, LocalAccountSigner, optimism, optimismSepolia } from "@alchemy/aa-core";
import { http } from "viem";

const chains = {
  "10": optimism, // op
  "11155420": optimismSepolia, // op sepolia
  "8453": base, // base
}

export const smartAccountClient = async (chainId: "10" | "11155420" | "8453") => await createLightAccountClient({
  transport: http("https://opt-sepolia.g.alchemy.com/v2/RuW3M-sKKB2IOPgalS76_EnjArmTW5X8") as any,
  chain: chains[chainId],
  account: {
    signer: LocalAccountSigner.privateKeyToAccountSigner(
      "0xe294a8cfc1ac060045124caed38b25c3ec92c42895b9da61e4b444ee652fe33e"
      // public private key. we don not care about security here since the validator should check the ring signature. Here we used a premade account for the poc.
      // the idea is to broadcast a userOperation to the bundler with the ring signature in the signature field. The validator verifies it and if it is correct, it will be included the operation will be executed.
      // the paymaster should approve the operation only if the target address is the voting contract and the function signature is one of the allowed functions.

      // signer address: 0x24F568c2f570c26D98a60FD2Ea1E9843f20eF143
    ),
  },
});

// console.log("account address: ", smartAccountClient.account.address); // 0xb6a927118F2C45Db1EF912Cb4E01A14A81D89029

const result = await (await smartAccountClient("11155420")).sendUserOperation({
  uo: { target: "0x808a3fa3cb908eea383dd083962a820282758d79", data: "0x", value: BigInt(0) },
});

// console.log(result);
