import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getProfile(@GetUser('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  @UseGuards(JwtGuard)
  @Get('reporter')
  getCustomers() {
    return this.userService.getReporters();
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  updateProfile(@GetUser('userId') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }
}
