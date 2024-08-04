import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainListing from './components/MainListing';
import ProposalDetail from './components/Proposal';
import About from './components/About';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<MainListing />} />
            <Route path="/proposals/:id" element={<ProposalDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<div>My Profile</div>} />
            <Route path="/proposals" element={<MainListing />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;