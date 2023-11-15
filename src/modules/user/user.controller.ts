import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './userDTO/createUser.dto';
import { UpdateUserDto } from './userDTO/updateUser.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ResponseModel } from 'src/interface/responseModel.interface';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllUsers() {
    const res: ResponseModel = {
      data: [],
      message: 'Get Users successfully',
      code: HttpStatus.OK,
    };
    try {
      res.data = this.userService.getAllUsers();
    } catch (error) {
      res.message = 'Something wrong !';
      res.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } finally {
      return res;
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createNewUser(@Body() createUserDto: CreateUserDto) {
    const res: ResponseModel = {
      data: [],
      message: 'Create User successfully',
      code: HttpStatus.OK,
    };
    try {
      res.data = this.userService.createUser(createUserDto);
    } catch (error) {
      res.message = 'Something wrong !';
      res.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } finally {
      return res;
    }
  }

  @Get('/:id')
  async getUser(@Param('id') userId: string) {
    const res: ResponseModel = {
      data: [],
      message: 'Get User information successfully',
      code: HttpStatus.OK,
    };
    try {
      res.data = await this.userService.getUser(userId);
    } catch (error) {
      res.message = 'Something wrong !';
      res.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } finally {
      return res;
    }
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateUser(@Param('id') userId: string, @Body() userUpdate: UpdateUserDto) {
    const res: ResponseModel = {
      data: [],
      message: 'Update User information successfully',
      code: HttpStatus.OK,
    };
    try {
      res.data = this.userService.updateUser(userId, userUpdate);
    } catch (error) {
      res.message = 'Something wrong !';
      res.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } finally {
      return res;
    }
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) userId: string) {
    const res: ResponseModel = {
      data: [],
      message: 'Delete User successfully',
      code: HttpStatus.OK,
    };
    try {
      res.data = this.userService.deleteUser(userId);
    } catch (error) {
      res.message = 'Something wrong !';
      res.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } finally {
      return res;
    }
  }
}
