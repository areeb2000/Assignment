export interface Department {
  id?: number;
  name: string;
  description?: string;
  manager_id?: number;
  manager?: {
    first_name: string;
    last_name: string;
  };
  budget?: number;
  employee_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentResponse {
  success: boolean;
  data: {
    departments: Department[];
    total: number;
  };
  message?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  manager_id?: number;
  budget?: number;
}