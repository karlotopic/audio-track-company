import { EmployeeUtils } from './utils';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmployeeDto } from './dtos/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  public findByNameAndEmail(
    firstName: string,
    lastName: string,
    email: string,
  ) {
    return this.prisma.employee.findFirst({
      where: {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
      },
    });
  }

  public findByEmail(email: string) {
    return this.prisma.employee.findFirst({
      where: {
        Email: email,
      },
    });
  }

  public create(employee: EmployeeDto) {
    const employeeEntity = EmployeeUtils.dtoToEntity(employee);
    return this.prisma.employee.create({
      data: {
        ...employeeEntity,
      },
    });
  }
}
