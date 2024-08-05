import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Proposal } from '../utils/types';
import { fetchProposals } from '../api/apicall';

const MainListing: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProposals = async () => {
      try {
        const data = await fetchProposals();
        setProposals(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getProposals();
  }, []);

  const handleProposalClick = (id: string) => {
    navigate(`/proposals/${id}`);
  };

  const handleNewProposalClick = () => {
    navigate('/new-proposal');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">Proposals</h2>
        <button
          className="bg-blue-600 text-white rounded px-4 py-2"
          onClick={handleNewProposalClick}
        >
          New Proposal
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <table className="min-w-full bg-gray-700 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left text-white">Title</th>
              <th className="py-2 px-4 text-left text-white">Publication Date</th>
              <th className="py-2 px-4 text-left text-white">Closing Date</th>
              <th className="py-2 px-4 text-left text-white">Votes</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map(proposal => (
              <tr
                key={proposal.id}
                className="hover:bg-gray-600 cursor-pointer"
                onClick={() => handleProposalClick(proposal.id)}
              >
                <td className="py-2 px-4 text-white">{proposal.title}</td>
                <td className="py-2 px-4 text-white">{proposal.publicationDate}</td>
                <td className="py-2 px-4 text-white">{proposal.closingDate}</td>
                <td className="py-2 px-4 text-white">{proposal.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainListing;