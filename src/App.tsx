import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainListing from './components/MainListing';
import ProposalDetail from './components/Proposal';
import About from './components/About';
import Footer from './components/Footer';
import Onboarding from './components/Onboarding';
import MyProfile from './components/MyProfile';

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
            <Route path="/profile" element={<MyProfile/>} />
            <Route path="/proposals" element={<MainListing />} />
            <Route path="/newMember" element={<Onboarding />}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;