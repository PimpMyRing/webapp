import React from 'react';
import { Link } from 'react-router-dom'; // Importer Link depuis react-router-dom
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-darker-gray p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white text-lg font-semibold hover:text-gray-300">
            Home
          </Link>
          <Link to="/profile" className="text-white text-lg font-semibold hover:text-gray-300">
            My Profile
          </Link>
          <Link to="/about" className="text-white text-lg font-semibold hover:text-gray-300">
            About
          </Link>
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;