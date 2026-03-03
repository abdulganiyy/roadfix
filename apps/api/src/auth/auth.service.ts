import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto';
import { generateOtp } from './helpers/generate-otp';
import { RoleName } from 'generated/prisma/enums';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (userExists) throw new ForbiddenException('Email already exists');

    const hashedPassword = await argon2.hash(dto.password);

    const { otp, hash } = generateOtp();

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        emailOtpHash: hash,
        emailOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      },
    });

    const userRole = await this.prisma.role.findUnique({
      where: { name: RoleName.user },
    });

    await this.prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: userRole!.id,
      },
    });

    const { accessToken } = await this.signTokens(
      user.id,
      user.email as string,
    );

    await this.mailService.sendEmailOtp({
      to: user.email as string,
      otp,
      name: user.name as string,
    });

    const { password: _, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) throw new ForbiddenException('Incorrect credentials');

    const valid = await argon2.verify(user.password, dto.password);
    if (!valid) throw new ForbiddenException('Incorrect credentials');

    const { accessToken } = await this.signTokens(
      user.id,
      user.email as string,
    );

    const { password: _, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
    };
  }

  async loginStaff(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) throw new ForbiddenException('Incorrect credentials');

    const roles = user.userRoles.map((ur) => ur.role.name);

    if (!roles.length || (roles.length == 1 && roles.includes('user')))
      throw new ForbiddenException('Insufficient privileges');

    const valid = await argon2.verify(user.password, dto.password);
    if (!valid) throw new ForbiddenException('Incorrect credentials');

    const { accessToken } = await this.signTokens(
      user.id,
      user.email as string,
    );

    const { password: _, ...safeUser } = user;

    return {
      safeUser,
      accessToken,
    };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.emailVerified) {
      throw new BadRequestException('Invalid verification attempt');
    }

    if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
      throw new BadRequestException('No OTP found');
    }

    if (user.emailOtpExpiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (otpHash !== user.emailOtpHash) {
      throw new BadRequestException('Invalid OTP');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailOtpHash: null,
        emailOtpExpiresAt: null,
      },
    });

    const { password: _, ...safeUser } = updatedUser;

    return { user: safeUser };
  }

  async resendEmailOtp(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.emailVerified) return;

    const { otp, hash } = generateOtp();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailOtpHash: hash,
        emailOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await this.mailService.sendEmailOtp({
      to: user.email as string,
      otp,
      name: user.name as string,
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const resetLink = `${this.config.get(
      'FRONTEND_URL',
    )}/reset-password?token=${hashedToken}`;

    await this.mailService.sendPasswordReset({
      to: user.email as string,
      resetLink,
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      },
    });
  }

  async signTokens(userId: string, email: string) {
    const payload = { userId, email };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: jwtConstants.secret,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return this.signTokens(decoded.sub, decoded.email);
    } catch (e) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
