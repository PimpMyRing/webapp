import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Proposal } from '../utils/types';
import { useAccount, useWriteContract } from 'wagmi';
import { DAOofTheRingABI as abi } from '../abi/DAOofTheRing';


const ProposalForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [value, setValue] = useState<number>(0);
  const [callData, setCallData] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { address } = useAccount();

  // Smart interaction

  const { data: hash, writeContract } = useWriteContract()

// End of smart interaction

  const handleSubmit = async (isAnonymous: boolean) => {
    const newProposal: Proposal = {
      id: '', // ID will be set by the backend
      title,
      description,
      publicationDate: new Date().toISOString().split('T')[0], // Current date
      closingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      votes: 0,
      author: isAnonymous ? 'Anon' : address || 'unknown',
    };

    try {
      const response = await fetch('http://localhost:3022/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProposal),
      });

      if (!response.ok) {
        throw new Error('Failed to submit proposal');
      }

      // Redirect to the proposals list or detail page after successful submission
      navigate('/proposals');
    } catch (error: any) {
      setError(error.message as string);
    }
  };

  const handlePublicSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit(false);
  };

  const handleAnonymousSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Submit a New Proposal</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
            <label className="block text-white mb-2" htmlFor="description">Target (Address)</label>
            <textarea
              id="target"
              value={target}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="description">CallData</label>
            <textarea
              id="calldata"
              value={callData}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              className="bg-blue-600 text-white rounded px-4 py-2 mt-2"
              onClick={handlePublicSubmit}
            >
              Submit Publicly
            </button>
            <button
              type="button"
              className="bg-gray-00 text-white rounded px-4 py-2 mt-2"
              onClick={handleAnonymousSubmit}
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