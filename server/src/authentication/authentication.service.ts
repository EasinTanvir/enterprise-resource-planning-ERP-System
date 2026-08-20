import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { and, eq } from 'drizzle-orm';
import { DATABASE, type Database } from '../database/database.provider';
import { users, userAuthAccounts } from '../database/schema';
import { RegisterDto } from './dto/register.dto';

export type SafeUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isPlatformAdmin: boolean;
};
export type GoogleIdentity = {
  providerAccountId: string;
  email: string;
  firstName: string;
  lastName: string;
};

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(DATABASE) private readonly database: Database,
    private readonly jwtService: JwtService,
  ) {}
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<SafeUser> {
    const user = await this.findUserByEmail(email);
    if (
      !user ||
      !user.isActive ||
      !user.passwordHash ||
      !(await bcrypt.compare(password, user.passwordHash))
    )
      throw new UnauthorizedException('Invalid credentials.');
    return this.toSafeUser(user);
  }
  async login(user: SafeUser) {
    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        isPlatformAdmin: user.isPlatformAdmin,
      }),
      tokenType: 'Bearer',
      user,
    };
  }

  async register(dto: RegisterDto) {
    const email = this.normalizeEmail(dto.email);
    const passwordHash = await bcrypt.hash(dto.password, 12);
    try {
      const user = await this.database.transaction(async (transaction) => {
        const [createdUser] = await transaction
          .insert(users)
          .values({
            email,
            passwordHash,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            phone: dto.phone?.trim() || null,
            isActive: true,
            isPlatformAdmin: false,
          })
          .returning();
        if (!createdUser) throw new Error('User creation returned no record.');
        await transaction.insert(userAuthAccounts).values({
          userId: createdUser.id,
          provider: 'credentials',
          providerAccountId: email,
          providerEmail: email,
        });
        return this.toSafeUser(createdUser);
      });
      return this.login(user);
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException(
          'An account with this email already exists.',
        );
      }
      throw error;
    }
  }
  async getActiveUser(userId: string): Promise<SafeUser> {
    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user || !user.isActive)
      throw new UnauthorizedException('Unauthorized.');
    return this.toSafeUser(user);
  }
  async resolveGoogleIdentity(identity: GoogleIdentity): Promise<SafeUser> {
    const email = this.normalizeEmail(identity.email);
    return this.database.transaction(async (tx) => {
      const [account] = await tx
        .select()
        .from(userAuthAccounts)
        .where(
          and(
            eq(userAuthAccounts.provider, 'google'),
            eq(userAuthAccounts.providerAccountId, identity.providerAccountId),
          ),
        )
        .limit(1);
      if (account) return this.getActiveUser(account.userId);
      const [existingUser] = await tx
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      const user =
        existingUser ??
        (
          await tx
            .insert(users)
            .values({
              email,
              firstName: identity.firstName || 'Google',
              lastName: identity.lastName || 'User',
              isActive: true,
            })
            .returning()
        )[0];
      if (!user || !user.isActive)
        throw new UnauthorizedException('Unauthorized.');
      await tx.insert(userAuthAccounts).values({
        userId: user.id,
        provider: 'google',
        providerAccountId: identity.providerAccountId,
        providerEmail: email,
      });
      return this.toSafeUser(user);
    });
  }
  private async findUserByEmail(email: string) {
    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.email, this.normalizeEmail(email)))
      .limit(1);
    return user;
  }
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    );
  }
  private toSafeUser(user: typeof users.$inferSelect): SafeUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isPlatformAdmin: user.isPlatformAdmin,
    };
  }
}
