export interface Employee {
  id?: number;
  employee_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  role: string;
  department_id: number;
  department?: string;
  salary?: number;
  hire_date: string;
  status: 'active' | 'inactive' | 'terminated';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeResponse {
  success: boolean;
  data: {
    employees: Employee[];
    total: number;
    filters_applied?: boolean;
  };
  message?: string;
}

export interface CreateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  role: string;
  department_id: number;
  salary?: number;
  hire_date: string;
  status: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}