import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-semibold text-white mb-4">About Pimp My Ring</h1>
        <p className="text-white mb-4">
          Pimp My Ring is a tooling for Decentralized Autonomous Organizations (DAOs) that innovates by using ring signatures. This unique approach allows the toolkit to provide privacy to DAO members through token-gated authentication based on ring signatures.
        </p>
        <h2 className="text-2xl font-semibold text-white mb-2">Key Features</h2>
        <ul className="list-disc list-inside text-white mb-4">
          <li><strong>Privacy-Preserving Authentication:</strong> Pimp My Ring leverages ring signatures to enable token-gated authentication, allowing members to interact with the DAO without revealing their individual identities.</li>
          <li><strong>Secure Voting System:</strong> The project also innovates by incorporating ring signatures into the DAO's voting system, enhancing the privacy and security of the decision-making process.</li>
          <li><strong>Decentralized Governance:</strong> Pimp My Ring is designed to empower DAO members with a decentralized governance model, where decisions are made collectively and transparently.</li>
          <li><strong>Metamask Snap Integration:</strong> Pimp My Ring leverages the Metamask Snap API to seamlessly integrate the ring signature process into the user experience, providing a familiar and secure way for members to authenticate and vote within the DAO.</li>
        </ul>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Alice's Ring - Cypher Lab's Snap Integration</h2>
        <p className="text-white mb-4">
          This Snap utilizes the ring signature implementation from Cypher Lab to privately sign messages. The signature can then be verified by any third party without revealing the actual signer.
        </p>
        <p className="text-white mb-4">
          It supports two types of ring signatures: Spontaneous Anonymous Group signatures (SAG) and Linkable Spontaneous Anonymous Group signatures (LSAG). If you are using the SAG scheme, no one will ever know that you signed the message. Use the LSAG scheme if you want third parties to know you signed multiple messages without revealing your identity.
        </p>
        <h3 className="text-xl font-semibold text-white mb-2">Features:</h3>
        <ul className="list-disc list-inside text-white mb-4">
          <li>Create an Ethereum account</li>
          <li>Import an Ethereum account using a mnemonic</li>
          <li>Export the snap addresses</li>
          <li>Sign a message using SAG and LSAG with the snap</li>
          <li>Verify a SAG or LSAG signature</li>
        </ul>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-white mb-2">What are Ring Signatures?</h2>
        <p className="text-white mb-4">
          Ring signatures are a type of digital signature that allows a group of users to sign a message anonymously. Unlike traditional digital signatures uniquely linked to one user, ring signatures obscure the actual author by linking multiple possible signers together in a “ring.”
        </p>
        <p className="text-white mb-4">
          Ring signatures preserve privacy and anonymity by obscuring the specific originator of a message. By grouping possible signers in a “ring,” there is no way to definitively pinpoint the actual individual who authored the content. This prevents transactions from being easily traced back to a single user. The larger the ring of possible signers, the more anonymity is provided to the real originator.
        </p>
        <p className="text-white mb-4">
          Ring signatures have been known to cryptographers for several years, but their use within the blockchain ecosystem has been limited. The Monero blockchain is noted as one of the first to employ this cryptographic solution at the protocol level. However, there is currently no complete, robust, and audited implementation of ring signatures adapted for the browser environment. This is where we come in!
        </p>
        <p className="text-white">
          For more details, visit the <a href="https://snaps.metamask.io/snap/npm/cypher-laboratory/alicesring-snap/" className="text-blue-500 hover:text-blue-400">official documentation</a>.
        </p>
      </div>
    </div>
  );
};

export default About;