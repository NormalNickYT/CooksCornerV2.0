import type { Prisma, User } from "@prisma/client";
import { prisma } from "../../core/prisma";

/** All database access for accounts. Nothing above this layer writes SQL. */
export class AuthRepository {
  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  findByGoogleId(googleId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { googleId } });
  }

  findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }
}

export const authRepository = new AuthRepository();
