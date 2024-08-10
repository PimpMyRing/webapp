import React, { useEffect, useState } from 'react';
import { fetchDiscussionByProposalId, postMessage } from '../api/apicall';
import type { Discussion as DiscussionType, Message } from '../utils/types';
import { submitMessageRing } from '../utils/submitMessage';
import { useAccount } from 'wagmi';

interface DiscussionProps {
  proposalId: string;
  chainId: string;
}

const Discussion: React.FC<DiscussionProps> = ({ proposalId, chainId }) => {
  const [discussion, setDiscussion] = useState<DiscussionType | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>(''); // State to hold the new message
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State to handle submission status
  const { address } = useAccount();

  useEffect(() => {
    const getDiscussion = async () => {
      try {
        const data = await fetchDiscussionByProposalId(proposalId);
        if (data === null || data.messages.length === 0) {
          setIsEmpty(true);
        } else {
          setDiscussion(data);
        }
      } catch (error) {
        setError('Error fetching discussion data');
      }
    };

    getDiscussion();
  }, [proposalId, chainId]);

  const handleAddMessage = async () => {
    if (newMessage.trim() === '') {
      setError('Message cannot be empty.');
      return;
    }
    setIsSubmitting(true);

    try {
      const newMessageObject: Omit<Message, 'id'> = {
        body: newMessage,
        sender: 'Anon Ring Member',
        date: new Date().toISOString(),
      };
      const result= await submitMessageRing(proposalId,address ||'', 'full', newMessage);
      if(result)
      {
        await postMessage(proposalId, newMessageObject);

      }
      else {
        throw new Error("Failed to sign the message.");
      }

      
      setDiscussion(prev => {
        if (prev) {
          return {
            ...prev,
            messages: [...prev.messages, { ...newMessageObject, id: prev.messages.length + 1 }],
          };
        }
        return {
          proposalId,
          messages: [{ ...newMessageObject, id: 1 }],
        };
      });

      setNewMessage(''); // Clear the input field after submission
      setIsEmpty(false); // No longer empty after posting a message
      setIsSubmitting(false);
    } catch (error) {
      setError('Failed to submit the message.');
      setIsSubmitting(false);
    }
  };

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
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-2xl font-semibold text-white mb-4">Discussion</h3>
        <div className="text-gray-400 mb-4">No messages in this discussion. Be the first to post a message!</div>
        <div className="mt-6">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white mb-4"
            placeholder="Write your message here..."
            rows={4}
          />
          <div className="flex justify-center">
            <button
              onClick={handleAddMessage}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Add Message'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-2xl font-semibold text-white mb-4">Discussion</h3>
      {discussion ? (
        <>
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
          <div className="mt-6">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
              placeholder="Write your message here..."
              rows={4}
            />
            <div className="flex justify-center">
              <button
                onClick={handleAddMessage}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Add Message'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center">
          <div className="border-t-4 border-b-4 border-white rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Discussion;