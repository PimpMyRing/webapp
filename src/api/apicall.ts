// src/utils/api.ts

import { Proposal } from '../utils/types';

export const fetchProposals = async (): Promise<Proposal[]> => {
    // Simuler une réponse API pour les tests
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Proposal 1',
            publicationDate: '2023-01-01',
            closingDate: '2023-01-10',
            votes: 100,
          },
          {
            id: '2',
            title: 'Proposal 2',
            publicationDate: '2023-02-01',
            closingDate: '2023-02-10',
            votes: 200,
          },
          {
            id: '3',
            title: 'Proposal 3',
            publicationDate: '2023-03-01',
            closingDate: '2023-03-10',
            votes: 300,
          },
        ]);
      }, 1000);
    });
  };
  
  export const fetchProposalById = async (id: string): Promise<Proposal | null> => {
    const proposals = await fetchProposals();
    return proposals.find(proposal => proposal.id === id) || null;
  };