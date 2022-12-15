import { Employee } from '@prisma/client';
import { EmployeeDto } from '../dtos/employee.dto';

export class EmployeeUtils {
  public static dtoToEntity(
    employeeDto: EmployeeDto,
  ): Omit<Employee, 'EmployeeId'> {
    return {
      LastName: employeeDto.lastName,
      FirstName: employeeDto.firstName,
      Title: employeeDto.title || null,
      ReportsTo: employeeDto.reportsTo || null,
      BirthDate: employeeDto.birthDate || null,
      HireDate: employeeDto.hireDate || null,
      Address: employeeDto.address || null,
      City: employeeDto.city || null,
      State: employeeDto.state || null,
      Country: employeeDto.country || null,
      PostalCode: employeeDto.postalCode || null,
      Phone: employeeDto.phone || null,
      Fax: employeeDto.fax || null,
      Email: employeeDto.email || null,
    };
  }
}
