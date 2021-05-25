import { google } from 'googleapis';

export type TSnsProvider = 'google' | 'facebook' | 'twitter' | 'apple';

const { FACEBOOK_ID, GOOGLE_ID, GOOGLE_SECRET, PROD_HOST } = process.env;

const redirectPath = `/oauth/`;
export const redirectUri =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:5000${redirectPath}`
    : `http://${PROD_HOST}${redirectPath}`;

export function generateSnsLoginLink(provider: TSnsProvider, next: string = '/') {
  const generators = {
    google(next: string) {
      const callback = `${redirectUri}done`;
      const oauth2Client = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, callback);
      const url = oauth2Client.generateAuthUrl({
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ],
        state: JSON.stringify({ sns_type: 'google' }),
        access_type: 'offline'
      });

      return url;
    },
    facebook(next: string) {
      const state = JSON.stringify({ next });
      const callbackUri = `${redirectUri}facebook`;
      return `https://www.facebook.com/v4.0/dialog/oauth?client_id=${FACEBOOK_ID}&redirect_uri=${callbackUri}&state=${state}&scope=email,public_profile`;
    },
  };
  
  const generator = generators[provider];
  return generator(encodeURI(next));
}