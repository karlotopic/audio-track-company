import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtUtil } from './utils';
import { EmployeeService } from '../employee/employee.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private employeeService: EmployeeService,
    private reflector: Reflector,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const allowUnauth = this.reflector.get<boolean>(
      'allowUnauth',
      ctx.getHandler(),
    );
    if (allowUnauth) return true;

    const req = ctx.switchToHttp().getRequest() as Request;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided!');
    }

    const [authType, token] = authHeader.split(' ');
    if (authType !== 'Bearer') {
      throw new BadRequestException('Wrong token type!');
    }

    try {
      const decoded = JwtUtil.verify(token);
      const employee = await this.employeeService.findByEmail(decoded.email);
      if (!employee) throw new UnauthorizedException('User does not exist!');
    } catch (err) {
      throw new UnauthorizedException('Invalid JWT token!');
    }

    return true;
  }
}
