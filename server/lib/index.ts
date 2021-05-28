import { google } from 'googleapis';
import axios from 'axios';

export type TSnsProvider = 'google' | 'facebook' | 'twitter' | 'apple';

const {
  GOOGLE_ID,
  GOOGLE_SECRET,
  FACEBOOK_ID,
  FACEBOOK_OAUTH_VERSION,
  APPLE_ID,
  APPLE_REDIRECT_URL,
  PROD_HOST
} = process.env;

const redirectPath = `/oauth/`;
export const redirectUri =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:3000${redirectPath}`
    : `http://${PROD_HOST}${redirectPath}`;

export function generateSnsLoginLink(provider: TSnsProvider, next: string = '/') {
  const generators = {
    google() {
      const callback = `${redirectUri}done`;
      const oauth2Client = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, callback);
      const url = oauth2Client.generateAuthUrl({
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ],  // Auth로 가져올 데이터 범위
        state: JSON.stringify({ sns_type: 'google' }),
        access_type: 'offline'
      });

      return url;
    },
    facebook() {
      const state = JSON.stringify({ sns_type: 'facebook' });
      const callbackUri = `${redirectUri}done`;
      
      return `https://www.facebook.com/${FACEBOOK_OAUTH_VERSION}/dialog/oauth?client_id=${FACEBOOK_ID}&redirect_uri=${callbackUri}&state=${state}&scope=email,user_gender,user_birthday`;
    },
    apple() {
      const state = JSON.stringify({ sns_type: 'apple' });
      const callbackUri = `${redirectUri}done`;

      return `https://appleid.apple.com/auth/authorize?response_type=code&client_id=${APPLE_ID}&redirect_uri=${callbackUri}&scope=email&state=${state}&response_mode=form_post`;
    }
  };
  
  const generator = generators[provider];
  return generator(encodeURI(next));
}