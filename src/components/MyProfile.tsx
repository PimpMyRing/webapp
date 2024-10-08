import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { installSnap, getAddresses } from '@cypher-laboratory/alicesring-snap-sdk';
import { isSbtOwner } from '../utils/isSbtOwner';

const MyProfile: React.FC = () => {
  const [showOnboardingPopup, setShowOnboardingPopup] = useState<boolean>(false);
  const [showConnectMessage, setShowConnectMessage] = useState<boolean>(false);
  const [snapInstalled, setSnapInstalled] = useState<boolean>(false);
  const [ringAddresses, setRingAddresses] = useState<string[]>([]);
  const [displayedMsg, setDisplayedMsg] = useState<{ msg: string, color: string } | null>(null);
  const [importAccountInSnap, setImportAccountInSnap] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();

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

  const checkOnboarding = () => {
    if (!address) return;
    (async () => {
      // get chainId from the provider
      const provider = window.ethereum;
      if (!provider) {
        return;
      }
      const chainId = (await provider.request({ method: 'eth_chainId' })).toString();
      console.log('chainId:', chainId);
      const storedData = localStorage.getItem(`${address}_${BigInt(chainId)}`);
      if(storedData) {
        setShowOnboardingPopup(false);
        return;
      }
      const onboarded = localStorage.getItem('onboarded' + chainId);
      const refusedAt = localStorage.getItem('refusedAt');
      const currentTime = new Date().getTime();
      console.log('onboarded:', onboarded);
      if (onboarded === null || onboarded === 'false') {
        // checks if the user his a token owner
        // console.log("is owner ? ", await isSbtOwner(address));
        console.log('chainId: ', chainId);
        console.log('is owner ? ', await isSbtOwner(address));
        console.log('onboarded is ls:', localStorage.getItem('onboarded' + chainId));
        if (address && await isSbtOwner(address) && localStorage.getItem('onboarded' + chainId) !== null) {
          console.log('is owner');
          localStorage.setItem('onboarded' + chainId, 'true');
          return;
        } else {
          setShowOnboardingPopup(true);

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
      }
    })();
  };

  useEffect(() => {
    if (isConnected) {
      checkOnboarding();
    } else {
      setShowConnectMessage(true);
    }
  }, [isConnected]);

  const handleJoinDao = () => {
    const provider = window.ethereum;
    if (!provider) {
      return;
    }
    const chainId = (provider.request({ method: 'eth_chainId' })).toString();

    localStorage.setItem('onboarded' + chainId, 'true');
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
      if (addresses.length === 0) {
        setDisplayedMsg({ msg: 'No addresses found. Either you have no addresses registered in the Snap or an error occurred.', color: 'orange-600' });
        setImportAccountInSnap(true);
      } else {
        setRingAddresses(addresses);
        setDisplayedMsg({ msg: 'Addresses imported successfully!', color: 'green-600' });
      }
      setTimeout(() => {
        setDisplayedMsg(null);
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
        {(isConnected) && (
          <>
            <p className="text-white mb-4"><strong>Main Wallet:</strong> {address}</p>
            <div className="text-white mb-4">
              <strong>Your Addresses:</strong>
              {ringAddresses.length > 0 ? (
                <ul className="list-disc list-inside">
                  {ringAddresses.map((ringAddress, index) => (
                    <li key={index}>{ringAddress}</li>
                  ))}
                </ul>
              ) : (
                <p>No addresses found.</p>
              )}
            </div>
            <button
              className="bg-blue-600 text-white rounded px-4 py-2 mt-2"
              onClick={handleImportAddresses}
            >
              Import Addresses
            </button>
            {displayedMsg && (
              <div className={`bg-${displayedMsg.color} text-white rounded-full px-4 py-2 mt-2 text-center`}>
                {displayedMsg.msg}
              </div>
            )}
            {
              importAccountInSnap && (
                <div className="bg-gray-800 text-white rounded-full px-4 py-2 mt-2 text-center">
                  <p>Would you like to import your account in the Snap?</p>
                  <div className="flex justify-center space-x-4 mt-2">
                    {/* <button
                      className="bg-gray-500 text-white rounded px-4 py-2"
                      onClick={() => setImportAccountInSnap(false)}
                    >
                      Cancel
                    </button> */}
                    <button
                      className="bg-green-600 text-white rounded px-4 py-2"
                      onClick={() => navigate('/importAccount')}
                    >
                      Import Account
                    </button>
                  </div>
                </div>
              )
            }
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