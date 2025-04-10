import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Organization } from '../types';
import { fetchOrganizations } from '../services/api';

interface ContactFormProps {
  onSubmit: (data: ContactFormSubmitData) => void;
  initialData?: Partial<ContactFormData>;
}

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization_id: string | null;
}

export interface ContactFormSubmitData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization_id?: number;
}

const schema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().matches(/^[0-9+\-() ]*$/, 'Invalid phone number format').required('Phone is required'),
  organization_id: yup.string().nullable(),
});

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, initialData }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver<ContactFormData, any, ContactFormData>(schema),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      organization_id: initialData?.organization_id?.toString() || null,
    },
  });

  useEffect(() => {
    fetchOrganizations()
      .then(response => {
        setOrganizations(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching organizations:', error);
        setIsLoading(false);
      });
  }, []);

  const onSubmitForm: SubmitHandler<ContactFormData> = (data) => {
    const formattedData: ContactFormSubmitData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      organization_id: data.organization_id ? parseInt(data.organization_id) : undefined,
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="first_name"
          {...register('first_name')}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.first_name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.first_name && (
          <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id="last_name"
          {...register('last_name')}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.last_name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.last_name && (
          <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="organization_id" className="block text-sm font-medium text-gray-700">
          Organization
        </label>
        <select
          id="organization_id"
          {...register('organization_id')}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.organization_id ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        >
          <option value="">Select an organization</option>
          {organizations.map(org => (
            <option key={org.id} value={org.id.toString()}>
              {org.name}
            </option>
          ))}
        </select>
        {errors.organization_id && (
          <p className="mt-1 text-sm text-red-600">{errors.organization_id.message}</p>
        )}
        {isLoading && (
          <p className="mt-1 text-sm text-gray-500">Loading organizations...</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Contact
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
