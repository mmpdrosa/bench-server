import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { PrismaService } from 'nestjs-prisma';

import { auth } from 'src/config/firebase';
import { CreateProductNotificationDto } from './dto/create-product-notification.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

  async notifyProduct(
    user_id: string,
    product_id: string,
    { price }: CreateProductNotificationDto,
  ) {
    const notification = await this.prisma.userProductNotification.findFirst({
      where: { user_id, product_id },
    });

    return notification
      ? await this.prisma.userProductNotification.update({
          where: { id: notification.id },
          data: { price },
        })
      : await this.prisma.userProductNotification.create({
          data: { user_id, product_id, price },
        });
  }

  async findAllUserProductNotifications(user_id: string) {
    return this.prisma.userProductNotification.findMany({
      where: { user_id },
      select: {
        id: true,
        price: true,
        product: { select: { id: true, image_url: true, title: true } },
      },
    });
  }

  async unnotifyProduct(user_id: string, product_id: string) {
    const notification = await this.prisma.userProductNotification.findFirst({
      where: { user_id, product_id },
    });

    if (notification) {
      return this.prisma.userProductNotification.delete({
        where: { id: notification.id },
      });
    } else {
      throw new NotFoundException('Notification not found');
    }
  }
}
