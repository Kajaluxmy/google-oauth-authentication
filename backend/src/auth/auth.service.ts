import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const googleClientId =
      this.configService.get<string>('GOOGLE_CLIENT_ID');

    if (!googleClientId) {
      throw new Error(
        'GOOGLE_CLIENT_ID is not configured',
      );
    }

    this.googleClient = new OAuth2Client(
      googleClientId,
    );
  }

  async loginWithGoogle(idToken: string) {
    if (!idToken) {
      throw new UnauthorizedException(
        'ID token is required',
      );
    }

    try {
      const googleClientId =
        this.configService.get<string>(
          'GOOGLE_CLIENT_ID',
        );

      console.log(
        'Google Client ID exists:',
        !!googleClientId,
      );

      const ticket =
        await this.googleClient.verifyIdToken({
          idToken,
          audience: googleClientId,
        });

      console.log('Google token verified successfully');

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException(
          'Invalid Google token',
        );
      }

      const {
        sub,
        email,
        name,
        picture,
      } = payload;

      console.log('Google user:', {
        sub,
        email,
        name,
      });

      if (!sub || !email) {
        throw new UnauthorizedException(
          'Google token does not contain required user information',
        );
      }

      let user =
        this.usersService.findByGoogleId(sub);

      if (!user) {
        user =
          this.usersService.createUser({
            googleId: sub,
            email,
            name: name || '',
            picture: picture || '',
          });
      }

      console.log('User found/created:', user.email);

      const accessToken =
        this.jwtService.sign({
          sub: user.id,
          email: user.email,
        });

      console.log('JWT created successfully');

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
        },
      };
    } catch (error) {
      console.error(
        'Google login error:',
        error,
      );

      throw new UnauthorizedException(
        error instanceof Error
          ? error.message
          : 'Google authentication failed',
      );
    }
  }

  async getCurrentUser(userId: string) {
    const user =
      this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    };
  }
}