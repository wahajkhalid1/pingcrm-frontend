import { useEffect, useState } from 'react';
import { Contact, Organization } from '../types';
import { fetchContacts, deleteContact, updateContact, updateOrganization } from '../services/api';
import ContactForm from './ContactForm';
import OrganizationForm from './OrganizationForm';
import type { ContactFormSubmitData } from './ContactForm';
import type { OrganizationFormData } from './OrganizationForm';

interface ContactListProps {
  search?: string;
  organizationId?: number;
}

const ContactList: React.FC<ContactListProps> = ({
  search,
  organizationId
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchContacts(search, organizationId);
      setContacts(response.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [search, organizationId]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await deleteContact(id);
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Failed to delete contact');
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
  };

  const handleUpdateContact = async (data: ContactFormSubmitData) => {
    if (!editingContact) return;

    try {
      await updateContact(editingContact.id, data);
      setEditingContact(null);
      await loadContacts();
    } catch (err) {
      console.error('Error updating contact:', err);
      alert('Failed to update contact');
    }
  };

  const handleUpdateOrganization = async (data: OrganizationFormData) => {
    if (!editingOrganization) return;

    try {
      await updateOrganization(editingOrganization.id, data);
      setEditingOrganization(null);
      await loadContacts();
    } catch (err) {
      console.error('Error updating organization:', err);
      alert('Failed to update organization');
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading contacts...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <button
          onClick={loadContacts}
          className="ml-4 text-blue-500 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Contacts</h2>
      {editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Contact</h2>
              <button
                onClick={() => setEditingContact(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ContactForm
              onSubmit={handleUpdateContact}
              initialData={{
                first_name: editingContact.first_name,
                last_name: editingContact.last_name,
                email: editingContact.email,
                phone: editingContact.phone,
                organization_id: editingContact.organization_id?.toString() || null
              }}
            />
          </div>
        </div>
      )}
      {editingOrganization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Organization</h2>
              <button
                onClick={() => setEditingOrganization(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <OrganizationForm
              onSubmit={handleUpdateOrganization}
              initialData={{
                name: editingOrganization.name,
                address: editingOrganization.address
              }}
            />
          </div>
        </div>
      )}
      {contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Organization</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {contact.first_name} {contact.last_name}
                  </td>
                  <td className="px-4 py-2">{contact.email}</td>
                  <td className="px-4 py-2">{contact.phone}</td>
                  <td className="px-4 py-2">
                    {contact.organization ? (
                      <div className="flex items-center">
                        <span>{contact.organization.name}</span>
                        <button
                          onClick={() => handleEditOrganization(contact.organization!)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          title="Edit Organization"
                        >
                          ✎
                        </button>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactList;
