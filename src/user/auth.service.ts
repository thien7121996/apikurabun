import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/LoginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(req: RegisterUserDto) {
    const userByEmail = await this.userService.findByEmail(req.email);
    if (userByEmail) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(req.password, 12);

    req.password = hashedPassword;
    const savedUser = await this.userService.create(req);
    const payload = {
      id: savedUser.id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      msg: 'User created',
      access_token,
    };
  }

  async login(req: LoginUserDto) {
    const userByEmail = await this.userService.findByEmail(req.email);

    if (!userByEmail) throw new BadRequestException('Email not found');

    const isMatchPassword = await bcrypt.compare(
      req.password,
      userByEmail.password,
    );

    if (!isMatchPassword) throw new BadRequestException('Password not match');
    const payload = {
      id: userByEmail.id,
      email: userByEmail.email,
      firstName: userByEmail.firstName,
      lastName: userByEmail.lastName,
      role: userByEmail.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      msg: 'User loged in',
      access_token,
    };
  }
}
