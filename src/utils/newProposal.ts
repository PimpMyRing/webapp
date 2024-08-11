import { LSAG_signature } from "@cypher-laboratory/alicesring-snap-sdk";
import { ALCHEMY_URL, GOVERNANCE_CONTRACT } from "../constant";
import { getRing } from "./vote";
import { ethers } from "ethers";
import { RingSignature } from "@cypher-laboratory/alicesring-lsag";
import { GovernanceContractAbi } from "../abi/DAOofTheRing";
import { smartAccountClient } from "../alchemy-aa";
import { keccak_256 } from "@cypher-laboratory/alicesring-lsag/dist/src/utils";

export async function getProposalCount(chainId: number): Promise<number> {
  try {
    // Create an instance of a provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let governanceAddress = "";

    switch (chainId) {
      case 10:
        governanceAddress = GOVERNANCE_CONTRACT["10"];
        break;
      case 11155420:
        governanceAddress = GOVERNANCE_CONTRACT["11155420"];
        break;
      case 8453:
        governanceAddress = GOVERNANCE_CONTRACT["8453"];
        break;
      default:
        throw new Error("Unsupported chainId");
    }

    // Create an instance of a contract
    const contract = new ethers.Contract(governanceAddress, GovernanceContractAbi, provider);

    // Call the proposalCount function
    const proposalCount = await contract.proposalCount();

    // Return the proposal count as a number
    return proposalCount.toNumber();
  } catch (error) {
    console.error('Error reading proposal count:', error);
    throw new Error('Failed to read proposal count.');
  }
}

export async function newProposal(chainId: number, proposal: { description: string, target?: string, value?: bigint, calldata?: string }): Promise<string> {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(); // todo: use a relay so the user does not leak their address

  let governanceAddress = "";

  switch (chainId) {
    case 10:
      governanceAddress = GOVERNANCE_CONTRACT["10"];
      break;
    case 11155420:
      governanceAddress = GOVERNANCE_CONTRACT["11155420"];
      break;
    case 8453:
      governanceAddress = GOVERNANCE_CONTRACT["8453"];
      break;
    default:
      throw new Error("Unsupported chainId");
  }

  const contract = new ethers.Contract(governanceAddress, ["function newProposal(string memory _description, address target, uint256 value, bytes memory callData) public"], signer);

  const tx = await contract.newProposal(keccak_256([proposal.description]), proposal.target ?? "0x0000000000000000000000000000000000000000", proposal.value ?? BigInt(0), proposal.calldata ?? "0x");

  return (await tx.wait()).transactionHash;
};


export async function newAnonProposal(chainId: number, userAddress: string, proposal: { description: string, target?: string, value?: bigint, calldata?: string }): Promise<string> {
  const ring = chainId !== 8453 ? await getRing() : [];

  // message = keccak256(abi.encodePacked(proposal description, target, value, callData))
  const message = ethers.utils.solidityKeccak256(
    ["string", "address", "uint256", "bytes"],
    [proposal.description, proposal.target || ethers.constants.AddressZero, proposal.value || 0, proposal.calldata || "0x"]
  );

  const sig = await LSAG_signature(
    ring,
    message,
    userAddress,
    `${chainId}_dao-of-the-ring`
  );

  const signature: RingSignature = RingSignature.fromBase64(sig);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner(); // Use a relay so the user does not leak their address

  let address = '';
  switch (chainId) {
    case 10:
      address = GOVERNANCE_CONTRACT["10"];
      break;
    case 11155420:
      address = GOVERNANCE_CONTRACT["11155420"];
      break;
    case 8453:
      address = GOVERNANCE_CONTRACT["8453"];
      break;
    default:
      throw new Error("Unsupported chainId");
  }

  const contract = new ethers.Contract(
    address,
    GovernanceContractAbi,
    provider,
  );

  const formattedRing: bigint[] = [];
  const pointRing = signature.getRing();
  for (let i = 0; i < pointRing.length; i++) {
    formattedRing.push(pointRing[i].x);
    formattedRing.push(pointRing[i].y);
  }

  // const tx = await contract.anonProposal(
  //   proposal.description,
  //   proposal.target || ethers.constants.AddressZero,
  //   proposal.value || 0n,
  //   proposal.calldata || "0x",
  //   formattedRing,
  //   signature.getResponses(),
  //   signature.getChallenge(),
  //   [signature.getKeyImage().x, signature.getKeyImage().y],
  //   `${chainId}_dao-of-the-ring`,
  //   signature.getEvmWitnesses()
  // );

  // encode the function call
  const callData = contract.interface.encodeFunctionData(
    "anonProposal",
    [
      keccak_256([proposal.description]),
      proposal.target || ethers.constants.AddressZero,
      proposal.value || 0n,
      proposal.calldata || "0x",
      formattedRing,
      signature.getResponses(),
      signature.getChallenge(),
      [signature.getKeyImage().x, signature.getKeyImage().y],
      `${chainId}_dao-of-the-ring`,
      signature.getEvmWitnesses()
    ]
  );

  const smartAccount = await smartAccountClient(chainId.toString() as "10" | "11155420" | "8453");
  // console.log("contract address: ", contract.address);
  const result = await smartAccount.sendUserOperation({
    uo: { target: contract.address as `0x${string}`, data: callData as `0x${string}`, value: BigInt(0) },
  });
  // console.log("result: ", result);
  // get the actual txHash
  const alchemyProvider = new ethers.providers.JsonRpcProvider(ALCHEMY_URL[chainId.toString() as "10" | "11155420" | "8453"]);
  let cpt = 0;
  do {
    cpt++;
    const hash = await alchemyProvider.send("eth_getUserOperationByHash", [result.hash]);
    if (hash.transactionHash) {
      return hash.transactionHash;
    }

    // wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } while (cpt < 10);

  throw new Error("No tx hash have been retrieved for the userOpHash: " + result.hash + ". Please check the txs from the account address: " + smartAccount.account.address);
}