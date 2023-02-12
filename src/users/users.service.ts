import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { auth } from 'src/config/firebase';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  async create({ email, password, photo_url, username }: CreateUserDto) {
    try {
      const user = await auth.getUserByEmail(email);

      if (user) {
        throw new HttpException(
          'This email address is already in use',
          HttpStatus.CONFLICT,
        );
      }
    } catch {}

    await auth.createUser({
      displayName: username,
      email,
      password,
      photoURL: photo_url,
    });
  }

  findAll() {
    return auth.listUsers();
  }

  findOne(id: string) {
    return auth.getUser(id);
  }

  remove(id: string) {
    return auth.deleteUser(id);
  }
}
