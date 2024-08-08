import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Proposal } from '../utils/types';
import { fetchProposalById } from '../api/apicall';
import Discussion from './Discussion';
import { vote } from '../utils/vote';
import { installSnap } from '@cypher-laboratory/alicesring-snap-sdk';
import { incrementVoteCount } from "../api/apicall";

const ProposalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const { address } = useAccount();
  const { chainId } = useAccount();
  const [voteData, setVoteData] = useState<{ voted: boolean, side: string } | null>(null)

  useEffect(() => {
    // check if user has already voted
    try {
      if (proposal) {
        const vote = localStorage.getItem(address + "_" + chainId + "_" + proposal.id);

        if (vote !== null) {
          const voteObj = JSON.parse(vote);
          setVoteData({ voted: voteObj.voted, side: voteObj.side })
        }
      }
    } catch (e) {

    }
  }, []);

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

  const handleVote = async (side: boolean, privacyLevel: 'full' | 'partial') => {
    if (!id || !address) return;

    setIsVoting(true);
    try {
      // Check if the Snap is installed
      const isInstalled = await installSnap();
      if (!isInstalled) {
        throw new Error('Snap installation failed. Please install the Snap to proceed.');
      }

      const chainID = chainId || 1;
      console.log('Chain ID:', chainID);
      const txHash = await vote(side, chainID, id, address, privacyLevel);
      console.log('Transaction hash:', txHash);
      await incrementVoteCount(id);
      localStorage.setItem(address + "_" + chainId + "_" + proposal?.id, JSON.stringify({ voted: true, side: side }));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsVoting(false);
      setVoteData({ voted: true, side: side ? 'for' : 'against' });
    }
  };

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
        <h2 className="text-3xl font-semibold text-white mb-4 text-center">{proposal.title}</h2>
        <div className="bg-gray-900 text-gray-400 rounded p-4 mb-4">
          <pre className="whitespace-pre-wrap break-words">{proposal.description}</pre>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <div className="bg-blue-500 text-white rounded-full px-4 py-2">
            <strong>Publication Date:</strong> {proposal.publicationDate}
          </div>
          <div className="bg-blue-600 text-white rounded-full px-4 py-2">
            <strong>Closing Date:</strong> {proposal.closingDate}
          </div>
          <div className="bg-blue-700 text-white rounded-full px-4 py-2">
            <strong>Votes:</strong> {proposal.votes}
          </div>
          <div className="bg-blue-700 text-white rounded-full px-4 py-2">
            <strong>Author:</strong> {proposal.author}
          </div>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          {
            voteData !== null && voteData.voted === true &&
            <div>
              <p>You voted {voteData.side} this proposal</p>
            </div>
          }
          {(!voteData || (voteData !== null && voteData.voted === false)) &&
            <div>
              <button
                className="bg-blue-600 text-white rounded px-4 py-2"
                onClick={() => handleVote(false, JSON.parse(localStorage.getItem(address + "_" + chainId)!).privacyLevel)}
                disabled={isVoting}
              >
                Vote against
              </button>
              <button
                className="bg-gray-600 text-white rounded px-4 py-2"
                onClick={() => handleVote(true, JSON.parse(localStorage.getItem(address + "_" + chainId)!).privacyLevel)}
                disabled={isVoting}
              >
                Vote in favor
              </button>
            </div>
          }
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <Discussion proposalId={proposal.id} />
    </div>
  );
};

export default ProposalDetail;