import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { installSnap, getAddresses } from '@cypher-laboratory/alicesring-snap-sdk';

const MyProfile: React.FC = () => {
  const [showOnboardingPopup, setShowOnboardingPopup] = useState<boolean>(false);
  const [showConnectMessage, setShowConnectMessage] = useState<boolean>(false);
  const [snapInstalled, setSnapInstalled] = useState<boolean>(false);
  const [ringAddresses, setRingAddresses] = useState<string[]>([]);
  const [imported, setImported] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();

  const checkOnboarding = () => {
    const onboarded = localStorage.getItem('onboarded');
    const refusedAt = localStorage.getItem('refusedAt');
    const currentTime = new Date().getTime();

    if (onboarded === null || onboarded === 'false') {
      if (refusedAt) {
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

  useEffect(() => {
    if (isConnected) {
      checkOnboarding();
    } else {
      setShowConnectMessage(true);
    }
  }, [isConnected]);

  const handleJoinDao = () => {
    localStorage.setItem('onboarded', 'true');
    navigate('/newMember');
  };

  const handleRefuse = () => {
    localStorage.setItem('refusedAt', new Date().getTime().toString());
    setShowOnboardingPopup(false);
  };

  const handleImportAddresses = async () => {
    const isInstalled = await installSnap();
    if (isInstalled) {
      setSnapInstalled(true);
      const addresses = await getAddresses();
      setRingAddresses(addresses);
      setImported(true);
      setTimeout(() => {
        setImported(false);
      }, 3000);
    } else {
      setSnapInstalled(false);
      // Handle snap installation failure
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">My Profile</h2>
        {!isConnected && (
          <div className="bg-red-600 text-white rounded-full px-4 py-2 text-center">
            You must connect first before checking your profile
          </div>
        )}
        {isConnected && (
          <>
            <p className="text-white mb-4"><strong>Main Wallet:</strong> {address}</p>
            <div className="text-white mb-4">
              <strong>Ring Addresses:</strong>
              {ringAddresses.length > 0 ? (
                <ul className="list-disc list-inside">
                  {ringAddresses.map((ringAddress, index) => (
                    <li key={index}>{ringAddress}</li>
                  ))}
                </ul>
              ) : (
                <p>No Ring Addresses found.</p>
              )}
            </div>
            <button
              className="bg-blue-600 text-white rounded px-4 py-2 mt-2"
              onClick={handleImportAddresses}
            >
              Import Ring Addresses
            </button>
            {imported && (
              <div className="bg-green-600 text-white rounded-full px-4 py-2 mt-2 text-center">
                Addresses imported successfully!
              </div>
            )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfile;