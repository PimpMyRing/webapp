import React, { useEffect, useState } from 'react';
import {
  detectRingSignatureSnap,
  installSnap,
  importAccount,
  exportKeyImages,
  getAddresses
} from '@cypher-laboratory/alicesring-snap-sdk';
import { ethers } from 'ethers';
import { NFT_ADDRESS } from '../constant';
import { useNavigate } from 'react-router-dom';

const OnboardingStep: React.FC = () => {
  const [privacyLevel, setPrivacyLevel] = useState<'full' | 'partial'>('full');
  const [isRSSnapInstalled, setIsRSSnapInstalled] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [metaMaskAddress, setMetaMaskAddress] = useState<string | null>(null);
  const [snapAddresses, setSnapAddresses] = useState<string[]>([]);
  const [keyImage, setKeyImage] = useState<string | null>(null);
  const navigate = useNavigate(); // useNavigate hook

  // Check if the user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const chainId = (await provider.getNetwork()).chainId;
        const storedData = localStorage.getItem(`${address}_${chainId}`);
        if (storedData) {
          navigate('/');
          return;
        }
      }
    };
    checkOnboardingStatus();
  }, [navigate]);

  useEffect(() => {
    (async () => {
      if (await detectRingSignatureSnap()) {
        setIsRSSnapInstalled(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (step === 1 && isRSSnapInstalled) {
      setStep(2);
    }
  }, [step, isRSSnapInstalled]);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setMetaMaskAddress(address);
      setStep(1);
    } else {
      alert('MetaMask is not installed. Please install it to proceed.');
    }
  };

  const handleInstallSnap = async () => {
    console.log('Installing the snap');
    const result = await installSnap();
    if (result) {
      setIsRSSnapInstalled(true);
      setStep(2);
    }
  };

  const handleExportAddresses = async () => {
    console.log('Exporting snap addresses');
    const addresses = await getAddresses();
    if (addresses && addresses.length > 0) {
      setSnapAddresses(addresses);

      if (
        metaMaskAddress &&
        addresses.map((address: string) => address.toLowerCase()).includes(metaMaskAddress.toLowerCase())
      ) {
        setStep(4);
        return;
      } else {
        alert('Current MetaMask address does not match any exported snap addresses. Please import the account.');
      }
    }
    setStep(3);
  };

  const handleImportAccount = async () => {
    console.log('Importing MetaMask account into snap');
    const imported = await importAccount();
    if (imported) {
      await handleExportAddresses();
    }
  };

  const handleExportKeyImages = async () => {
    console.log('Exporting key images with linkability flag "chainId-dao-of-the-ring"');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = await provider.getNetwork();
    const keyImages = await exportKeyImages(snapAddresses, `${chainId.chainId}_dao-of-the-ring`);
    if (keyImages) {
      console.log('Key images exported:', keyImages);
      const keyImage = keyImages.find((ki) => ki.address.toLowerCase() === metaMaskAddress?.toLowerCase())?.keyImage;
      if (!keyImage) return;
      setKeyImage(keyImage);
      setStep(5);
    }
  };

  const handlePrivacyChange = (level: 'full' | 'partial') => {
    setPrivacyLevel(level);
  };

  const handleMintMembershipNFT = async () => {
    if (privacyLevel && metaMaskAddress) {
      console.log(`Minting membership NFT with ${privacyLevel} privacy.`);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const chainId = await provider.getNetwork();

      let membershipAddress = "";
      switch (chainId.chainId) {
        case 10: {
          membershipAddress = NFT_ADDRESS.optimism;
          break;
        }
        case 11155420: {
          membershipAddress = NFT_ADDRESS.optimism_sepolia;
          break;
        }
        case 8453: {
          membershipAddress = NFT_ADDRESS.base;
          break;
        }
        default:
          alert('Please switch to Optimism, OP sepolia or Base to mint the NFT.');
          return;
      }

      const contract = new ethers.Contract(membershipAddress, ["function mint(uint8 level) public"], signer);
      const tx = await contract.mint(privacyLevel === 'full' ? 1 : 0);
      console.log("mint tx: " + (await tx.wait()).transactionHash);;
      // Display a snackbar or toast message to the user
      alert('Membership NFT minted successfully.');

      localStorage.setItem(metaMaskAddress + "_" + chainId.chainId, JSON.stringify({ privacyLevel, keyImage }));
      setStep(6);
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
              onClick={connectMetaMask}
              className="bg-green-600 text-white rounded-full px-4 py-2"
            >
              Start My Journey
            </button>
          </div>
        )}

        {step === 1 && !isRSSnapInstalled && (
          <div className="flex justify-center">
            <button
              onClick={handleInstallSnap}
              className="bg-blue-600 text-white rounded-full px-4 py-2"
            >
              Install the MetaMask Plugin
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex justify-center">
            <button
              onClick={handleExportAddresses}
              className="bg-blue-600 text-white rounded-full px-4 py-2"
            >
              Export Snap Addresses
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex justify-center">
            <button
              onClick={handleImportAccount}
              className="bg-blue-600 text-white rounded-full px-4 py-2"
            >
              Import MetaMask Account into Snap
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Select Your Privacy Level</h3>
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
                onClick={privacyLevel === 'full' ? handleExportKeyImages : () => setStep(5)}
                className="bg-blue-600 text-white rounded-full px-4 py-2"
              >
                {privacyLevel === 'full' ? "Export Key Image" : "Next step"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center">
            <div className="mb-6">
              <p className="text-gray-400">You are ready to mint your membership NFT!</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleMintMembershipNFT}
                className="bg-green-600 text-white rounded-full px-4 py-2"
              >
                Mint Membership NFT
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Congratulations!</h3>
            <p className="text-gray-400">You have successfully minted your membership NFT. Welcome to the DAO!</p>
            <button
              className="bg-blue-600 text-white rounded-full px-4 py-2"
              onClick={() => navigate('/')}
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingStep;
