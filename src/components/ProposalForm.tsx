import React, { useState, useEffect } from 'react';
import { Proposal } from '../utils/types';
import { useAccount } from 'wagmi';
import { newAnonProposal, newProposal, getProposalCount } from '../utils/newProposal';
import {
  detectRingSignatureSnap,
  installSnap
} from '@cypher-laboratory/alicesring-snap-sdk';

const ProposalForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [callData, setCallData] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snapInstalled, setSnapInstalled] = useState<boolean>(false);
  const { address, chainId, isConnected } = useAccount();

  useEffect(() => {
    const checkSnapInstalled = async () => {
      if (isConnected) {
        const isInstalled = await detectRingSignatureSnap();
        setSnapInstalled(isInstalled);
      }
    };

    checkSnapInstalled();
  }, [isConnected]);

  const handleInstallSnap = async () => {
    try {
      await installSnap();
      setSnapInstalled(true);
    } catch (error) {
      console.error('Failed to install snap:', error);
      setError('Failed to install snap.');
    }
  };

  const handleSubmit = async (isAnonymous: boolean) => {
    setIsLoading(true);
    setError(null);
    setTxHash(null);
    if(!chainId) throw new Error("No wallet connected");
    const proposalCount = await getProposalCount(chainId);
    console.log('Proposal count:', proposalCount);

    const proposal: Proposal = {
      id: proposalCount.toString(),
      title,
      description,
      publicationDate: new Date().toISOString().split('T')[0], // Current date
      closingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      votes: 0,
      author: isAnonymous ? 'Anon' : address || 'unknown',
    };

    console.log("proposal:\n", proposal);

    // try {
      if (address && chainId) {
        const result = isAnonymous
          ? await newAnonProposal(
            chainId,
            address,
            {
              description: proposal.description,
              target: target || undefined,
              value: callData ? BigInt(callData) : undefined,
              calldata: callData || undefined,
            }
          )
          : await newProposal(
            chainId,
            {
              description: proposal.description,
              target: target || undefined,
              value: callData ? BigInt(callData) : undefined,
              calldata: callData || undefined,
            }
          );

        console.log('Anon proposal result:', result);
        setTxHash(result);
      }
    // } catch (error) {
    //   console.error('Failed to submit anon proposal:', error);
    //   setError('Failed to submit anon proposal.');
    //   setIsLoading(false);
    //   return;
    // }

    try {
      if (!chainId) throw new Error("No chainId found. is you wallet connected ?");
      const response = await fetch(`http://localhost:3022/api/proposals/${chainId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...proposal, proposalId: proposalCount }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit proposal');
      }

      const data = await response.json();
      setProposalId(data.id);
    } catch (error: any) {
      setError(error.message as string);
    }

    setIsLoading(false);
  };

  const handlePublicSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit(false);
  };

  const handleAnonymousSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit(true);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-600 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">You must connect first before submitting a proposal.</h2>
        </div>
      </div>
    );
  }

  if (!snapInstalled) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-600 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">The snap is not installed.</h2>
          <button
            className="bg-blue-600 text-white rounded px-4 py-2"
            onClick={handleInstallSnap}
          >
            Install Snap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Submit a New Proposal</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {txHash && <p className="text-green-500 mb-4">Success! Transaction Hash: {txHash} & Proposal ID: {proposalId}</p>}
        {isLoading && (
          <div className="flex items-center justify-center mb-4">
            <div className="border-t-4 border-b-4 border-white rounded-full w-16 h-16 animate-spin"></div>
          </div>
        )}
        <form>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="target">Target (Address)</label>
            <input
              id="target"
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="callData">CallData</label>
            <textarea
              id="callData"
              value={callData}
              onChange={(e) => setCallData(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              className="bg-gray-600 text-white rounded px-4 py-2 mt-2"
              onClick={handlePublicSubmit}
              disabled={isLoading}
            >
              Submit Publicly
            </button>
            <button
              type="button"
              className="bg-blue-600 text-white rounded px-4 py-2 mt-2"
              onClick={handleAnonymousSubmit}
              disabled={isLoading}
            >
              Submit Anonymously
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalForm;