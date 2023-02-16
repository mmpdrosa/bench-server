import { ConflictException, Injectable } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { auth } from 'src/config/firebase';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private mapUser(user: UserRecord) {
    const { uid, displayName, email, customClaims } = user;
    return { uid, username: displayName, email, role: customClaims };
  }

  async create({ email, password, photo_url, username }: CreateUserDto) {
    try {
      const user = await auth.getUserByEmail(email);

      if (user) {
        throw new ConflictException('This email address is already in use');
      }
    } catch (err) {
      if (err.code !== 'auth/user-not-found') {
        throw err;
      }
    }

    const user = await auth.createUser({
      displayName: username,
      email,
      password,
      photoURL: photo_url,
    });

    return this.mapUser(user);
  }

  async findAll() {
    try {
      const { users } = await auth.listUsers();

      return users.map((user) => this.mapUser(user));
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string) {
    try {
      const user = await auth.getUser(id);

      return this.mapUser(user);
    } catch (err) {
      throw err;
    }
  }

  remove(id: string) {
    try {
      return auth.deleteUser(id);
    } catch (err) {
      throw err;
    }
  }
}
