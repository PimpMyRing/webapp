import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Proposal } from '../utils/types';
import { fetchProposals } from '../api/apicall';

const MainListing: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [showOnboardingPopup, setShowOnboardingPopup] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboarding = () => {
      const onboarded = localStorage.getItem('onboarded');
      const refusedAt = localStorage.getItem('refusedAt');
      const currentTime = new Date().getTime();

      if (onboarded === null || onboarded === 'false') {
        if (refusedAt) {
          console.log('refusedAt:', refusedAt);
          const refusedTime = new Date(parseInt(refusedAt, 10)).getTime();
          const tenMinutesInMs = 10 * 60 * 1000;
          if (currentTime - refusedTime > tenMinutesInMs) {
            setShowOnboardingPopup(true);
          }
        } else {
          setShowOnboardingPopup(true);
        }
      }
    };

    const getProposals = async () => {
      try {
        const data = await fetchProposals();
        setProposals(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    checkOnboarding();
    getProposals();
  }, []);

  const handleProposalClick = (id: string) => {
    navigate(`/proposals/${id}`);
  };

  const handleJoinDao = () => {
    localStorage.setItem('onboarded', 'true');
    navigate('/newMember');
  };

  const handleRefuse = () => {
    localStorage.setItem('refusedAt', new Date().getTime().toString());
    setShowOnboardingPopup(false);
  };

  return (
    <div className="container mx-auto p-4">
      {showOnboardingPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
            <h3 className="text-xl font-semibold mb-4">Join the DAO</h3>
            <p className="mb-6">Would you like to become a member of the DAO and participate in governance?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white rounded px-4 py-2"
                onClick={handleRefuse}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white rounded px-4 py-2"
                onClick={handleJoinDao}
              >
                Join DAO
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">Proposals</h2>
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
