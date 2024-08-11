import { ethers } from "ethers";
import { LSAG_signature } from "@cypher-laboratory/alicesring-snap-sdk";
import { Point, RingSignature, sortRing } from "@cypher-laboratory/alicesring-lsag";
import { ALCHEMY_URL, GET_RING_URL, GOVERNANCE_CONTRACT } from "../constant";
import { smartAccountClient } from "../alchemy-aa";

export async function vote(side: boolean, chainId: number, proposalId: string, userAddress: string, privacyLevel: 'full' | 'partial'): Promise<string> {
  if (chainId !== 11155420) {
    alert("for this poc, Private & gasless voting in only available on optimism sepolia");
    throw new Error("for this poc, Private & gasless voting in only available on optimism sepolia");
  }
  const ring = await getRing();
  console.log('Initiating vote for proposalID:', proposalId);
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
      // case 10:
      //   address = GOVERNANCE_CONTRACT["10"];
      //   break;
      case 11155420:
        address = GOVERNANCE_CONTRACT["11155420"];
        break;
      // case 8453:
      //   address = GOVERNANCE_CONTRACT["8453"];
      //   break;
      default:
        throw new Error("Unsupported chainId");
    }

    const contract = new ethers.Contract(
      address,
      [
        'function voteTrue(uint256, uint256[], uint256[], uint256, uint256[2], string, uint256[]) external returns (bool)',
        'function voteFalse(uint256, uint256[], uint256[], uint256, uint256[2], string, uint256[]) external returns (bool)',
      ],
      signer
    );

    const formattedRing: bigint[] = [];
    const pointRing = signature.getRing();
    for (let i = 0; i < pointRing.length; i++) {
      formattedRing.push(pointRing[i].x);
      formattedRing.push(pointRing[i].y);
    }

    // const tx = side
    //   ? await contract.voteTrue(proposalId, formattedRing, signature.getResponses(), signature.getChallenge(), [signature.getKeyImage().x, signature.getKeyImage().y], signature.getLinkabilityFlag(), signature.getEvmWitnesses())
    //   : await contract.voteFalse(proposalId, formattedRing, signature.getResponses(), signature.getChallenge(), [signature.getKeyImage().x, signature.getKeyImage().y], signature.getLinkabilityFlag(), signature.getEvmWitnesses());

    // console.log('Transaction:', tx);
    // return (await tx.wait()).transactionHash;

    // encode the function call
    const callData = contract.interface.encodeFunctionData(
      "vote" + (side ? "True" : "False"),
      [
        proposalId,
        formattedRing,
        signature.getResponses(),
        signature.getChallenge(),
        [signature.getKeyImage().x, signature.getKeyImage().y],
        signature.getLinkabilityFlag(),
        signature.getEvmWitnesses(),
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

    throw new Error("Failed to get transaction hash");

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