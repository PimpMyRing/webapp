import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-darker-gray py-6">
      <div className="container mx-auto text-center text-white">
        <p className="text-lg">
          Pimp My Ring - An ETHGlobal Hackathon - By <a href="https://www.cypherlab.org/" className="text-blue-500 hover:text-blue-400">Cypher Lab</a>
        </p>
        <p className="text-sm mt-2">&copy; {currentYear}</p>
      </div>
    </footer>
  );
};

export default Footer;