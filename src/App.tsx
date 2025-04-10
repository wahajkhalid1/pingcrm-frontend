import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Contacts from './pages/Contacts';
import Organizations from './pages/Organizations';

const App: React.FC = () => {
  return (
    <Router>
      <div className='min-h-screen bg-gray-100'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/organizations' element={<Organizations />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
