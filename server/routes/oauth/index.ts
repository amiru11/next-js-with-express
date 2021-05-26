import { Router } from 'express';
import { redirectUri, generateSnsLoginLink } from '../../lib';
import * as google from '../../lib/google';
import * as facebook from '../../lib/facebook';

const {
  GOOGLE_ID,
  GOOGLE_SECRET,
  FACEBOOK_ID,
  FACEBOOK_SECRET,
  PROD_HOST
} = process.env;

const oAuth = Router();

/**
 * oAuth Router
 * /start/:provider
 * /done/:provider
 */
 const socialRedirect = async (req, res) => {
  const { provider } = req.params;
  const { next } = req.query;
  const validated = ['facebook', 'google', 'twitter', 'apple'].includes(provider);
  if (!validated) {
    res.status = 400;
    return;
  }

  const loginUrl = generateSnsLoginLink(provider, next);
  res.redirect(loginUrl);
};

oAuth.get('/start/:provider', socialRedirect);

oAuth.get('/done', async (req ,res) => {
  const { code, state }: { code?: string, state?: string } = req.query;
  const parsedState = JSON.parse(state);
  const snsType = parsedState?.sns_type ?? null;
  console.log('/done', req.query);

  if (!code || !snsType) {
    return res.sendStatus(400);
  }

  try {
    switch (snsType) {
      case 'google':
        const googleAccessToken = await google.getAccessToken({
          code,
          clientId: GOOGLE_ID,
          clientSecret: GOOGLE_SECRET,
          redirectUri: `${redirectUri}done`
        });
    
        console.log('accessToken', googleAccessToken);
    
        const googleProfile = await google.getProfile(googleAccessToken);

        console.log('googleProfile', googleProfile);
        break;
      case 'facebook':
        const facebookAccessToken = await facebook.getAccessToken({
          code,
          clientId: FACEBOOK_ID,
          clientSecret: FACEBOOK_SECRET,
          redirectUri: `${redirectUri}done`
        });
    
        console.log('facebookAccessToken', facebookAccessToken);

        const facebookProfile = await facebook.getProfile(facebookAccessToken);

        console.log('facebookProfile', facebookProfile);
        break;
      case 'twitter':
        break;
      case 'apple':
        break;
      default: break;
    }

    res.redirect('http://localhost:3000');
  } catch (err) {
    console.error('ERROR', err);
    res.sendStatus(500);
  }
});

export default oAuth;