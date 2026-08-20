import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthenticationService } from '../authentication.service';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private readonly auth: AuthenticationService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID') ?? 'disabled',
      clientSecret: config.get('GOOGLE_CLIENT_SECRET') ?? 'disabled',
      callbackURL:
        config.get('GOOGLE_CALLBACK_URL') ??
        'http://localhost:5000/authentication/google/callback',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const email = profile.emails?.[0]?.value;
    if (!email)
      throw new ServiceUnavailableException(
        'Google did not provide a verified email.',
      );
    return this.auth.resolveGoogleIdentity({
      providerAccountId: profile.id,
      email,
      firstName: profile.name?.givenName ?? '',
      lastName: profile.name?.familyName ?? '',
    });
  }
}
