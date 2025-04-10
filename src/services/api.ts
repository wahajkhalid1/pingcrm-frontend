import axios from 'axios';
import { Organization, Contact } from '../types';

const API_URL = 'http://127.0.0.1:8000'; // Update if your backend is hosted elsewhere

const api = axios.create({
  baseURL: API_URL
});

// Organizations
export const fetchOrganizations = () =>
  api.get<Organization[]>('/organizations/');
export const createOrganization = (
  data: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
) => api.post<Organization>('/organizations/', data);
export const updateOrganization = (
  id: number,
  data: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>
) => api.put<Organization>(`/organizations/${id}`, data);
export const deleteOrganization = (id: number) =>
  api.delete(`/organizations/${id}`);

// Contacts
export const fetchContacts = (search?: string, organizationId?: number) => {
  const params: Record<string, string | number> = {};
  if (search) params.search = search;
  if (organizationId) params.organization_id = organizationId;
  return api.get<Contact[]>('/contacts/', { params });
};
export const createContact = (
  data: Omit<Contact, 'id' | 'created_at' | 'updated_at'>
) => api.post<Contact>('/contacts/', data);
export const updateContact = (
  id: number,
  data: Partial<Omit<Contact, 'id' | 'created_at' | 'updated_at'>>
) => api.put<Contact>(`/contacts/${id}`, data);
export const deleteContact = (id: number) => api.delete(`/contacts/${id}`);
