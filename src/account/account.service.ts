import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  public findByEmployeeId(id: number) {
    return this.prisma.account.findFirst({
      where: {
        EmployeeId: id,
      },
    });
  }

  public findByEmail(email: string) {
    return this.prisma.account.findFirst({
      where: {
        Employee: {
          Email: email,
        },
      },
    });
  }

  public create(employeeId: number, password: string) {
    return this.prisma.account.create({
      data: {
        EmployeeId: employeeId,
        Password: password,
      },
    });
  }
}
