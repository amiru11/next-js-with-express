import axios from 'axios';
import qs from 'qs';

const { FACEBOOK_BASE_URL, FACEBOOK_OAUTH_VERSION } = process.env;

type TFacebookAccessTokenParams = {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
}

type TFacebookTokenPayload = {
  access_token: string;
  token_type: string;
  expires_in: string;
};

type TFacebookPicture = {
  data: {
    height: number;
    is_silhouette: boolean;
    url: string;
    width: number;
  }
}

type TFacebookProfilePayload = {
  id?: string;
  name: string;
  email: string | null;
  birthday?: string | null;
  gender?: string | null;
  picture: TFacebookPicture;
}

export async function getAccessToken({
  clientId,
  clientSecret,
  code,
  redirectUri 
}: TFacebookAccessTokenParams) {
  const query = qs.stringify({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri
  });

  const res = await axios.get<TFacebookTokenPayload>(`${FACEBOOK_BASE_URL}/${FACEBOOK_OAUTH_VERSION}/oauth/access_token?${query}`);

  console.log('getAccessToken', res.data);

  return res.data.access_token;
}

export async function getProfile(accessToken: string) {
  const query = qs.stringify({
    access_token: accessToken,
    fields: `name,birthday,email,gender,picture`
  })
  const res = await axios.get<TFacebookProfilePayload>(`${FACEBOOK_BASE_URL}/${FACEBOOK_OAUTH_VERSION}/me?${query}`);

  const {
    name,
    birthday,
    email,
    gender,
    picture
  } = res?.data;
  return {
    nickname: name,
    birthday,
    email,
    gender,
    thumbnail: picture?.data?.url ?? null
  }
}