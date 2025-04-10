import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
  <nav className='bg-gray-800 p-4'>
    <div className='container mx-auto flex space-x-4'>
      <Link to='/' className='text-white hover:text-gray-300'>
        Home
      </Link>
      <Link to='/contacts' className='text-white hover:text-gray-300'>
        Contacts
      </Link>
      <Link to='/organizations' className='text-white hover:text-gray-300'>
        Organizations
      </Link>
    </div>
  </nav>
);

export default Navbar;
