import { useState } from 'react';
import ContactList from '../components/ContactList';
import ContactForm from '../components/ContactForm';
import { createContact } from '../services/api';
import type { ContactFormSubmitData } from '../components/ContactForm';

const Contacts: React.FC = () => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactCreated = async (data: ContactFormSubmitData) => {
    setIsSubmitting(true);
    try {
      await createContact(data);
      setShowCreateForm(false);
      // Refresh the contact list
      window.location.reload();
    } catch (error) {
      console.error('Error creating contact:', error);
      alert('Failed to create contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Contact Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
        >
          Add Contact
        </button>
      </div>

      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search contacts...'
          value={search || ''}
          onChange={e => setSearch(e.target.value || undefined)}
          className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {showCreateForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Create New Contact</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className='text-gray-500 hover:text-gray-700'
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
            <ContactForm
              onSubmit={handleContactCreated}
            />
          </div>
        </div>
      )}

      <ContactList search={search} />
    </div>
  );
};

export default Contacts;
