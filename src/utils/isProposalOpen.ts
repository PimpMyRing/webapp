import { ethers } from 'ethers';
import { NFT_ADDRESS } from '../constant';
import { GovernanceContractAbi } from '../abi/DAOofTheRing';

// if th chain id is not 10, 11155420, or 8453, return false and log an error
export async function isProposalOpen(proposalId: number): Promise<boolean> {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(); // todo: use a relay so the user does not leak their address
  const chainId = (await provider.getNetwork()).chainId;

  let membershipAddress = "0x";

  switch (chainId) {
    case 10: {
      membershipAddress = NFT_ADDRESS.optimism;
      break;
    }
    case 11155420: {
      membershipAddress = NFT_ADDRESS.optimism_sepolia;
      break;
    }
    case 8453: {
      membershipAddress = NFT_ADDRESS.base;
      break;
    }
    default: {
      console.error("isSbtOwner: Unsupported chainId, returning false");
      return false;
    }
  }

  const contract = new ethers.Contract(membershipAddress, GovernanceContractAbi, signer);

  const proposal = await contract.proposals(proposalId);

  // extract the startTime time from the proposal

  console.log("proposal:\n", proposal);
  

  return false;
}

