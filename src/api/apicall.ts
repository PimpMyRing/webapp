import { Proposal, Discussion, Message } from '../utils/types';
import { API_URL } from "../constant";
import { ethers } from "ethers"

const API_BASE_URL = API_URL;

export const fetchProposals = async (): Promise<{ "10": Proposal[], "8453": Proposal[], "11155420": Proposal[] }> => {
  const response = await fetch(`${API_BASE_URL}/proposals`);
  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }
  const data = await response.json();
  return data;
};

export const fetchProposalById = async (id: string): Promise<Proposal | null> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const chainId = (await provider.getNetwork()).chainId;
  if (chainId != 10 && chainId != 8453 && chainId != 11155420) {
    throw new Error('Invalid chainId');
  }

  const response = await fetch(`${API_BASE_URL}proposals/${chainId}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch proposal');
  }
  const data = await response.json();
  return data;
};

export const fetchDiscussionByProposalId = async (proposalId: string): Promise<Discussion | null> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const chainId = (await provider.getNetwork()).chainId;
  if (chainId != 10 && chainId != 8453 && chainId != 11155420) {
    throw new Error('Invalid chainId');
  }
  const response = await fetch(`${API_BASE_URL}discussions/${chainId}/${proposalId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch discussion');
  }
  const data = await response.json();
  if (data.messages.length === 0) {
    return null; // Empty
  }
  return data;
};

export const submitProposal = async (newProposal: Proposal): Promise<void> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const chainId = (await provider.getNetwork()).chainId;
  if (chainId != 10 && chainId != 8453 && chainId != 11155420) {
    throw new Error('Invalid chainId');
  }

  const response = await fetch(`${API_BASE_URL}/proposals/${chainId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProposal),
  });

  if (!response.ok) {
    throw new Error('Failed to submit proposal');
  }
};

export const incrementVoteCount = async (proposalId: string): Promise<void> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const chainId = (await provider.getNetwork()).chainId;
  if (chainId != 10 && chainId != 8453 && chainId != 11155420) {
    throw new Error('Invalid chainId');
  }
  const response = await fetch(`${API_BASE_URL}/proposals/${chainId}/${proposalId}/vote`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to increment vote count');
  }
};

export const postMessage = async (
  proposalId: string,
  message: Omit<Message, 'id'> // Exclude id as it will be managed by the backend
): Promise<Message> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const chainId = (await provider.getNetwork()).chainId;
  const response = await fetch(`${API_URL}/discussions/${chainId}/${proposalId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error('Failed to post message');
  }

  const data = await response.json();
  return data;
};