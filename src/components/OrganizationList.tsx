import { useEffect, useState } from 'react';
import { Organization } from '../types';
import { fetchOrganizations, updateOrganization, createOrganization } from '../services/api';
import OrganizationForm from './OrganizationForm';
import type { OrganizationFormData } from './OrganizationForm';

const OrganizationList: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchOrganizations();
      setOrganizations(response.data);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load organizations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization);
  };

  const handleUpdate = async (data: OrganizationFormData) => {
    if (!editingOrganization) return;

    try {
      await updateOrganization(editingOrganization.id, data);
      setEditingOrganization(null);
      await loadOrganizations();
    } catch (err) {
      console.error('Error updating organization:', err);
      alert('Failed to update organization');
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading organizations...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <button
          onClick={loadOrganizations}
          className="ml-4 text-blue-500 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold'>Organizations</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
        >
          Add Organization
        </button>
      </div>

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
              onSubmit={handleUpdate}
              initialData={{
                name: editingOrganization.name,
                address: editingOrganization.address
              }}
            />
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Organization</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <OrganizationForm
              onSubmit={async (data) => {
                try {
                  await createOrganization(data);
                  setShowCreateForm(false);
                  await loadOrganizations();
                } catch (err) {
                  console.error('Error creating organization:', err);
                  alert('Failed to create organization');
                }
              }}
            />
          </div>
        </div>
      )}

      {organizations.length === 0 ? (
        <p>No organizations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map(org => (
                <tr key={org.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{org.name}</td>
                  <td className="px-4 py-2">{org.address}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(org)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
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

export default OrganizationList;
