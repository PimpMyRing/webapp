import { Proposal, Discussion } from '../utils/types';

const API_BASE_URL = 'http://localhost:3022/api'; // CHANGE ME DADDY

export const fetchProposals = async (): Promise<Proposal[]> => {
  const response = await fetch(`${API_BASE_URL}/proposals`);
  if (!response.ok) {
    throw new Error('Failed to fetch proposals');
  }
  const data = await response.json();
  return data;
};

export const fetchProposalById = async (id: string): Promise<Proposal | null> => {
  const response = await fetch(`${API_BASE_URL}/proposals/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch proposal');
  }
  const data = await response.json();
  return data;
};

export const fetchDiscussionByProposalId = async (proposalId: string): Promise<Discussion | null> => {
  const response = await fetch(`${API_BASE_URL}/discussions/${proposalId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch discussion');
  }
  const data = await response.json();
  if (data.messages.length === 0) {
    return null; // Empty
  }
  return data;
};