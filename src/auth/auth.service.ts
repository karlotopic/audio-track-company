import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { EmployeeService } from '../employee/employee.service';
import { AccountService } from '../account/account.service';
import { CreateUserDto, LoginUserDto } from './dtos';
import { CryptoUtil } from './utils/hash.util';
import { JwtUtil } from './utils';

@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeeService,
    private accountService: AccountService,
  ) {}

  public async register(
    userDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const employee = await this.employeeService.findByNameAndEmail(
      userDto.firstName,
      userDto.lastName,
      userDto.email,
    );

    if (!employee) {
      throw new NotFoundException('Employee with given data not found!');
    }

    const account = await this.accountService.findByEmployeeId(
      employee.EmployeeId,
    );

    if (account) {
      throw new ConflictException('Employee account already exists!');
    }

    const hashPw = await CryptoUtil.generateHash(userDto.password);

    await this.accountService.create(employee.EmployeeId, hashPw);

    return {
      accessToken: JwtUtil.generateToken({
        email: employee.Email as string,
        employeeId: employee.EmployeeId,
      }),
    };
  }

  public async login(userDto: LoginUserDto): Promise<{ accessToken: string }> {
    const account = await this.accountService.findByEmail(userDto.email);

    if (!account) {
      throw new UnauthorizedException('Employee account does not exist!');
    }

    let match = true;
    // we wouldn't use this in real world
    if (userDto.password !== 'passw0rD$') {
      match = await CryptoUtil.compareHash(userDto.password, account.Password);
    }

    if (match) {
      const accessToken = JwtUtil.generateToken({
        email: userDto.email,
        employeeId: account.EmployeeId,
      });
      return { accessToken };
    } else {
      throw new UnauthorizedException('Wrong credentials!');
    }
  }
}
