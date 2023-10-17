import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/LoginUser.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllUser() {
    return this.userService.findAll();
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateUserDto,
  ) {
    return this.userService.updateById(id, request);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteById(id);
  }

  @Post('register')
  registerUser(@Body() requestBody: RegisterUserDto) {
    return this.authService.register(requestBody);
  }

  @Post('login')
  loginUser(@Body() requestBody: LoginUserDto) {
    return this.authService.login(requestBody);
  }
}
