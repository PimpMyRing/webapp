import React, { useEffect, useState } from 'react';
import { detectRingSignatureSnap, installSnap, importAccount, exportKeyImages, getAddresses } from '@cypher-laboratory/alicesring-snap-sdk';

const OnboardingStep: React.FC = () => {
  const [privacyLevel, setPrivacyLevel] = useState<'full' | 'partial' | null>(null);
  const [isRSSnapInstalled, setIsRSSnapInstalled] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0); // New state to track the step
  const [daoId, setDaoId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (await detectRingSignatureSnap()) {
        setIsRSSnapInstalled(true);
        setStep(1);
      }
    })();
  }, []);

  const handlePrivacyChange = (level: 'full' | 'partial') => {
    setPrivacyLevel(level);
  };

  const handleInstallSnap = async () => {
    console.log('Installing the snap');
    const result = await installSnap();
    if (result) {
      setIsRSSnapInstalled(true);
      setStep(1);
    }
  };

  const handleExportAddresses = async () => {
    console.log('Exporting snap addresses');
    const addresses = await getAddresses();
    if (addresses) {
      console.log('Addresses exported:', addresses);
      setStep(2);
    }
  };

  const handleImportAccount = async () => {
    console.log('Importing new account');
    await importAccount();
    handleExportAddresses();
  };

  const handleExportKeyImages = async () => {
    console.log('Exporting key images with linkability flag "alphabet"');
    const keyImages = await exportKeyImages(['address'], 'alphabet');
    if (keyImages && keyImages.length > 0) {
      const keyImage = keyImages.find((ki) => ki.address === 'address')?.keyImage;
      if (!keyImage) {
        alert('Key image not found');
        return;
      }
      console.log('Key images exported:', keyImages);
      setStep(3);
      setDaoId(keyImage);
    }
  };

  const handleJoinDAO = () => {
    if (privacyLevel) {
      console.log(`User selected ${privacyLevel} privacy level and is joining the DAO.`);
      // Additional logic to join the DAO with the selected privacy level
    } else {
      alert('Please select a privacy level.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">Join Our DAO</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">What is a DAO?</h3>
          <p className="text-gray-400">
            A Decentralized Autonomous Organization (DAO) is an entity with no central leadership. Decisions are made from the bottom up, governed by a community organized around a specific set of rules enforced on a blockchain. Members of the DAO collectively own and manage the organization.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Privacy Levels Explained</h3>
          <p className="text-gray-400 mb-2">
            <strong>Full Privacy:</strong> You will have one unique identity per discussion or proposal. This ensures complete anonymity, as no one can link you to your messages or votes.
          </p>
          <p className="text-gray-400">
            <strong>Partial Privacy:</strong> You will be recognized by the same unique ID across all discussions and proposals. While your identity is consistent across the platform, your votes remain fully anonymous and cannot be linked to your discussions or messages.
          </p>
        </div>

        {step === 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleInstallSnap}
              className="bg-green-600 text-white rounded-full px-4 py-2"
            >
              Install the MetaMask Plugin
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleExportAddresses}
              className="bg-blue-600 text-white rounded-full px-4 py-2"
            >
              Export Snap Addresses
            </button>
            <button
              onClick={handleImportAccount}
              className="bg-blue-600 text-white rounded-full px-4 py-2"
            >
              Import New Account
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex justify-center">
            <button
              onClick={handleExportKeyImages}
              className="bg-blue-600 text-white rounded-full px-4 py-2"
            >
              Export Key Images
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Your DAO ID: {daoId}</h3>
              <p className="text-gray-400">Please select your privacy level before joining the DAO.</p>
            </div>
            <div className="flex justify-center space-x-4 mb-4">
              <label className={`flex items-center cursor-pointer ${privacyLevel === 'full' ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded-full px-4 py-2`}>
                <input
                  type="radio"
                  value="full"
                  checked={privacyLevel === 'full'}
                  onChange={() => handlePrivacyChange('full')}
                  className="hidden"
                />
                Full Privacy
              </label>
              <label className={`flex items-center cursor-pointer ${privacyLevel === 'partial' ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded-full px-4 py-2`}>
                <input
                  type="radio"
                  value="partial"
                  checked={privacyLevel === 'partial'}
                  onChange={() => handlePrivacyChange('partial')}
                  className="hidden"
                />
                Partial Privacy
              </label>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleJoinDAO}
                className="bg-green-600 text-white rounded-full px-4 py-2"
              >
                Join DAO
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingStep;
