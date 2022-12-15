export class EmployeeDto {
  lastName: string;
  firstName: string;
  title?: string;
  reportsTo?: number;
  birthDate?: Date;
  hireDate?: Date;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  fax?: string;
  email?: string;
}
