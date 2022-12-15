import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Matches, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Employees first name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Employees last name' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Employees email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Employees password, should contain 6 characters, one uppercase letter and one special character',
  })
  @IsNotEmpty()
  @Matches(/^(?=.{6,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/, {
    message:
      'Password must be at least 6 characters long and have one uppercase letter and one special charcter',
  })
  password: string;
}
