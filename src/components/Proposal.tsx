import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Proposal } from '../utils/types';
import { fetchProposalById } from '../api/apicall'; 

const ProposalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    const getProposal = async () => {
      try {
        if (id) {
          const data = await fetchProposalById(id);
          setProposal(data);
        }
      } catch (error) {
        console.error('Error fetching proposal data:', error);
      }
    };

    getProposal();
  }, [id]);

  if (!proposal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="border-t-4 border-b-4 border-white rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">{proposal.title}</h2>
        <p className="text-white mb-2"><strong>Publication Date:</strong> {proposal.publicationDate}</p>
        <p className="text-white mb-2"><strong>Closing Date:</strong> {proposal.closingDate}</p>
        <p className="text-white mb-2"><strong>Votes:</strong> {proposal.votes}</p>
      </div>
    </div>
  );
};

export default ProposalDetail;