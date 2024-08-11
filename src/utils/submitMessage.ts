import { ethers } from "ethers";
import { LSAG_signature } from "@cypher-laboratory/alicesring-snap-sdk";
import { Point, RingSignature, sortRing } from "@cypher-laboratory/alicesring-lsag";
import { GET_RING_URL } from "../constant";
import { useAccount } from 'wagmi';

export async function submitMessageRing( proposalId: string, userAddress: string, privacyLevel: 'full' | 'partial',newMessage:string): Promise<string> {
  const ring = await getRing();
  console.log('Initiating message for proposalID:', proposalId);
  // message = keccak256(abi.encodePacked(_proposalId))
  
  const messageBytes = ethers.utils.toUtf8Bytes(newMessage);

  // Convert proposalId to bytes32
  const proposalIdBytes = ethers.utils.hexZeroPad(ethers.utils.hexlify(ethers.BigNumber.from(proposalId)), 32);

  // Concatenate both
  const toRing = ethers.utils.concat([messageBytes, proposalIdBytes]);

  // Hash the concatenated data
  const message = ethers.utils.solidityKeccak256(["bytes"], [toRing]);


  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const chainId = (await provider.getNetwork()).chainId;
  console.log('Ring:', ring);
  console.log('Message:', message);
  console.log('User Address:', userAddress);
  console.log('Privacy Level:', privacyLevel);

  try {
    const sig = await LSAG_signature(
      ring,
      message,
      userAddress,
      privacyLevel === 'full' ? `${chainId}_dao-of-the-ring` : `${chainId}_dao-of-the-ring_${proposalId}`,
    );

    console.log('Signature:', sig);

    const signature: RingSignature = RingSignature.fromBase64(sig);
    console.log('Parsed Signature:', signature);

    
    return signature.getKeyImage().serialize();

  } catch (error) {
    console.error("Error while signing message:", error);
    throw new Error("Failed to sign the message.");
  }
}

export async function getRing(): Promise<string[]> {
  // fetch GET_RING_URL
  const response = await fetch(GET_RING_URL);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ring: ${response.statusText}`);
  }

  const data = await response.json();

  const ring = sortRing(data.map((point: string) => Point.deserialize(point.slice(2)))).map((point: Point) => point.serialize());
  return ring;
}