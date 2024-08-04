import React, { useEffect, useState } from 'react';
import { fetchDiscussionByProposalId } from '../api/apicall';
import type { Discussion as DiscussionType } from '../utils/types';

interface DiscussionProps {
  proposalId: string;
}

const Discussion: React.FC<DiscussionProps> = ({ proposalId }) => {
  const [discussion, setDiscussion] = useState<DiscussionType | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDiscussion = async () => {
      try {
        const data = await fetchDiscussionByProposalId(proposalId);
        if (data === null) {
          setIsEmpty(true); // La discussion est vide
        } else {
          setDiscussion(data);
        }
      } catch (error) {
        setError('Error fetching discussion data');
      }
    };

    getDiscussion();
  }, [proposalId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-600 text-white rounded-full px-4 py-2">
          {error}
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-blue-600 text-white rounded-full px-4 py-2">
          No messages in this discussion.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-2xl font-semibold text-white mb-4">Discussion</h3>
      {discussion ? (
        <ul>
          {discussion.messages.map((message, index) => (
            <li key={index} className="mb-4">
              <div className="bg-gray-900 text-gray-400 rounded p-4">
                <p className="text-sm text-gray-500">{message.date}</p>
                <p className="text-white">{message.body}</p>
                <p className="text-sm text-gray-500 text-right">- {message.sender}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center">
          <div className="border-t-4 border-b-4 border-white rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Discussion;