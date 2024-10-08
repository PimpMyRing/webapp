import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Proposal } from '../utils/types';
import { fetchProposals } from '../api/apicall';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';

const MainListing: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const navigate = useNavigate();
  const { address } = useAccount();

  const handleChainChanged = () => {
    console.log(`Network changed`);
    // Reload the page to ensure the app uses the new network
    window.location.reload();
  };

  useEffect(() => {
    const ethereum = window.ethereum as any;
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.off('chainChanged', handleChainChanged);
    };
  });

  useEffect(() => {
    const getProposals = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const chainId = (await provider.getNetwork()).chainId;
        if (chainId != 10 && chainId != 8453 && chainId != 11155420) {
          throw new Error('Invalid chainId');
        }
        const data = await fetchProposals();
        console.log('Data:\n', data);
        setProposals(data[chainId]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getProposals();
  }, []);

  const handleProposalClick = (id: string) => {
    navigate(`/proposals/${id}`);
  };

  const handleNewProposalClick = async () => {
    // get address from the provider
    const provider = window.ethereum;
    if (!provider) {
      alert('Please connect your wallet');
      return;
    }

    const chainId = await provider.request({ method: 'eth_chainId' });
    console.log('chainId:', chainId);
    const onboarded = localStorage.getItem(address + '_' + BigInt(chainId));
    let loggedIn = false;
    try {
      (async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        if (address) {
          loggedIn = true;
        }
      })();
    } catch (error) {
      alert('You need to be logged-in to create a proposal. Check My Profile section');
      return;
    }
    if (!onboarded || onboarded === 'false') {
      alert('You need to be onboarded to create a proposal. Check My Profile section');
      return;
    }
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