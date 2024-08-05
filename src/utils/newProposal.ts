import { LSAG_signature } from "@cypher-laboratory/alicesring-snap-sdk";
import { GOVERNANCE_CONTRACT } from "../constant";
import { getRing } from "./vote";
import { ethers } from "ethers";
import { Point, RingSignature } from "@cypher-laboratory/alicesring-lsag";

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

  const tx = await contract.newProposal(proposal.description, proposal.target ?? "0x0000000000000000000000000000000000000000", proposal.value ?? 0n, proposal.calldata ?? "0x");

  return (await tx.wait()).transactionHash;
};


export async function newAnonProposal(chainId: number, userAddress: string, proposal: { description: string, target?: string, value?: bigint, calldata?: string }): Promise<string> {

  const ring = await getRing();

  const message = ethers.utils.solidityKeccak256(["string"], [proposal.description]);

  const sig = await LSAG_signature(
    ring,
    message,
    userAddress,
    `${chainId}_dao-of-the-ring_${Date.now()}`,
  );


  // extract data from sig
  const signature: RingSignature = RingSignature.fromBase64(sig);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(); // todo: use a relay so the user does not leak their address

  // submit vote
  let address = "";
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
    [
      "function anonProposal(string memory _description, address target, uint256 value, bytes memory callData, uint256[] memory ring, uint256[] memory responses, uint256 c, uint256[2] memory keyImage, string memory linkabilityFlag, uint256[] memory witnesses) public",
    ],
    signer
  );

  const formattedRing: bigint[] = [];
  const pointRing = signature.getRing();
  for (let i = 0; i < pointRing.length; i++) {
    formattedRing.push(pointRing[i].x);
    formattedRing.push(pointRing[i].y);
  }

  // console.log("evmWitnesses:\n", signature.getEvmWitnesses());

  const tx = await contract.anonProposal(
    proposal.description, 
    proposal.target ?? "0x0000000000000000000000000000000000000000", 
    proposal.value ?? 0n, 
    proposal.calldata ?? "0x", 
    formattedRing,
    signature.getResponses(), 
    signature.getChallenge(), 
    [
     signature.getKeyImage().x,
      signature.getKeyImage().y
    ],
    signature.getLinkabilityFlag(), 
    signature.getEvmWitnesses()
  );

  // return tx hash
  return (await tx.wait()).transactionHash;
}