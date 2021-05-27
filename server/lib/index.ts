import { google } from 'googleapis';

export type TSnsProvider = 'google' | 'facebook' | 'twitter' | 'apple';

const { GOOGLE_ID, GOOGLE_SECRET, FACEBOOK_ID, FACEBOOK_OAUTH_VERSION, PROD_HOST } = process.env;

const redirectPath = `/oauth/`;
export const redirectUri =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:3000${redirectPath}`
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
        ],  // Auth로 가져올 데이터 범위
        state: JSON.stringify({ sns_type: 'google' }),
        access_type: 'offline'
      });

      return url;
    },
    facebook(next: string) {
      const state = JSON.stringify({ sns_type: 'facebook' });
      const callbackUri = `${redirectUri}done`;
      
      return `https://www.facebook.com/${FACEBOOK_OAUTH_VERSION}/dialog/oauth?client_id=${FACEBOOK_ID}&redirect_uri=${callbackUri}&state=${state}&scope=email,user_gender,user_birthday`;
    }
  };
  
  const generator = generators[provider];
  return generator(encodeURI(next));
}