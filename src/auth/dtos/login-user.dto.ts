import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-account.dto';

export class LoginUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
