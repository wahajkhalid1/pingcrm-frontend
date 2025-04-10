export interface Organization {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization_id: number;
  organization?: Organization;
  created_at: string;
  updated_at: string;
}
