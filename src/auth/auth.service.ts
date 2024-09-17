import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  EXPIRES_DAY_REFRESH_TOKEN = 7;
  REFRESH_TOKEN_NAME = 'refreshToken_teashop';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.id);

    return { user, ...tokens };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email);

    if (oldUser)
      throw new BadRequestException('Пользователь с таким email существует');

    const user = await this.userService.create(dto);
    const tokens = await this.issueTokens(user.id);

    return { user, ...tokens };
  }

  async issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('refreshToken не валидный');

    const user = await this.userService.getById(result.id);

    const tokens = await this.issueTokens(user.id);

    return { user, ...tokens };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user || !(await verify(user.password, dto.password)))
      throw new NotFoundException('Пользователь не найден');

    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRES_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      sameSite: 'none',
      secure: true,
    });
  }

  removeRefreshTokenFromResponce(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }

  async validateOAuthLogin(req: any) {
    let user = await this.userService.getByEmail(req.user.email);

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: req.user.email,
          name: req.user.name,
          picture: req.user.picture,
        },
        include: {
          stores: true,
          favorites: true,
          orders: true,
        },
      });
    }

    const tokens = await this.issueTokens(user.id);

    return { user, ...tokens };
  }
}
