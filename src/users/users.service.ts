import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { PrismaService } from 'nestjs-prisma';

import { FirebaseService } from '../firebase/firebase.service';
import { CreateProductNotificationDto } from './dto/create-product-notification.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
  ) {}

  private mapUser(user: UserRecord) {
    const { uid, displayName, email, customClaims } = user;
    return { uid, username: displayName, email, ...customClaims };
  }

  async create({ email, password, photo_url, username }: CreateUserDto) {
    try {
      const user = await this.firebase.auth.createUser({
        displayName: username,
        email,
        password,
        photoURL: photo_url,
      });

      const token = await this.firebase.auth.createCustomToken(user.uid);

      return token;
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        throw new ConflictException({ code: 'auth/email-already-exists' });
      }
    }
  }

  async findAll() {
    const { users } = await this.firebase.auth.listUsers();

    return users.map((user) => this.mapUser(user));
  }

  async findOne(id: string) {
    try {
      const user = await this.firebase.auth.getUser(id);

      return this.mapUser(user);
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async remove(id: string) {
    try {
      await this.firebase.auth.deleteUser(id);
    } catch (err) {
      throw new NotFoundException(err);
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
    const userProductNotifications =
      await this.prisma.userProductNotification.findMany({
        where: { user_id },
        select: {
          id: true,
          price: true,
          product: {
            select: {
              id: true,
              image_url: true,
              title: true,
              productRetailers: {
                orderBy: { price: 'asc' },
                take: 1,
                select: { price: true },
              },
            },
          },
        },
      });

    return userProductNotifications.map(({ id, price, product }) => ({
      id,
      price,
      product: {
        id: product.id,
        title: product.title,
        image_url: product.image_url,
        price: product.productRetailers[0].price,
      },
    }));
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
      throw new NotFoundException();
    }
  }

  async toggleCategoryNotification(user_id: string, category_id: string) {
    const notification = await this.prisma.userCategoryNotification.findFirst({
      where: { user_id, category_id },
    });

    return notification
      ? await this.prisma.userCategoryNotification.delete({
          where: { id: notification.id },
        })
      : await this.prisma.userCategoryNotification.create({
          data: { user_id, category_id },
        });
  }

  async findAllUserCategoryNotifications(user_id: string) {
    return this.prisma.userCategoryNotification.findMany({
      where: { user_id },
      select: {
        id: true,
        category: { select: { id: true, name: true } },
      },
    });
  }

  async makeUserAdmin(user_id: string) {
    await this.firebase.auth.setCustomUserClaims(user_id, { role: 'admin' });
  }

  findAllUserSalesReactions(user_id: string) {
    return this.prisma.saleReaction.findMany({
      where: { user_id },
      select: { sale_id: true, content: true },
    });
  }
}
