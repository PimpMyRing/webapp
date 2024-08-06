import { ethers } from "ethers";
import { LSAG_signature } from "@cypher-laboratory/alicesring-snap-sdk";
import { Point, RingSignature, sortRing } from "@cypher-laboratory/alicesring-lsag";
import { GET_RING_URL, GOVERNANCE_CONTRACT } from "../constant";

export async function vote(side: boolean, chainId: number, proposalId: string, userAddress: string, privacyLevel: 'full' | 'partial'): Promise<string> {
  const ring = await getRing();

  // message = keccak256(abi.encodePacked(_proposalId))
  const message = ethers.utils.solidityKeccak256(["uint256"], [proposalId]);

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

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); // todo: use a relay so the user does not leak their address

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
        'voteTrue(uint256 _proposalId, uint256[] memory ring, uint256[] memory responses, uint256 c, uint256[2] memory keyImage, string memory linkabilityFlag, uint256[] memory witnesses) public',
        'voteFalse(uint256 _proposalId, uint256[] memory ring, uint256[] memory responses, uint256 c, uint256[2] memory keyImage, string memory linkabilityFlag, uint256[] memory witnesses) public',
      ],
      signer
    );

    const formattedRing: bigint[] = [];
    const pointRing = signature.getRing();
    for (let i = 0; i < pointRing.length; i++) {
      formattedRing.push(pointRing[i].x);
      formattedRing.push(pointRing[i].y);
    }

    const tx = side
      ? contract.voteTrue(proposalId, formattedRing, signature.getResponses(), signature.getChallenge(), signature.getKeyImage(), [signature.getKeyImage().x, signature.getKeyImage().y], signature.getEvmWitnesses())
      : contract.voteFalse(proposalId, formattedRing, signature.getResponses(), signature.getChallenge(), signature.getKeyImage(), [signature.getKeyImage().x, signature.getKeyImage().y], signature.getEvmWitnesses());

    return (await tx.wait()).transactionHash;

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