export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  city: string;
  country: string;
  country_code: string;
  state: string;
  street_address: string;
  job_title: string;
  company_name: string;
  photo: string;
}

export interface UserTableProps {
  data: User[];
}

export interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (response: any) => void;
}

export interface ExportButtonProps {
  data: User[];
}


