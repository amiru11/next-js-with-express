import { google } from 'googleapis';

type TGoogleAccessTokenParams = {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
}

export async function getAccessToken({
  clientId,
  clientSecret,
  code,
  redirectUri 
}: TGoogleAccessTokenParams) {
  const googleOAuth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const { tokens } = await googleOAuth2.getToken(code);
  if (!tokens.access_token) {
    throw new Error('Failed to retrieve google access token');
  }
  
  return tokens.access_token;
}

export async function getProfile(accessToken: string) {
  const googlePeople = google.people('v1');
  const profile = await googlePeople.people.get({
    access_token: accessToken,
    resourceName: 'people/me',
    personFields: 'names,emailAddresses,photos'
  });
  const { data } = profile;
  
  console.log('profile', data);
  
  return {
    nickname: data.names![0].displayName,
    thumbnail: data.photos![0].url || null
  }
}