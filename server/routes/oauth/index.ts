import { Router } from 'express';
import { redirectUri, generateSnsLoginLink } from '../../lib';
import { getAccessToken, getProfile } from '../../lib/google';

const { FACEBOOK_ID, GOOGLE_ID, GOOGLE_SECRET, PROD_HOST } = process.env;

const oAuth = Router();

/**
 * oAuth Router
 * /start/:provider
 * /done
 */
 const socialRedirect = async (req, res) => {
  const { provider } = req.params;
  const { next } = req.query;
  const validated = ['facebook', 'google', 'github'].includes(provider);
  if (!validated) {
    res.status = 400;
    return;
  }

  const loginUrl = generateSnsLoginLink(provider, next);
  res.redirect(loginUrl);
};

oAuth.get('/start/:provider', socialRedirect);

oAuth.get('/done', async (req ,res) => {
  const { code }: { code?: string } = req.query;
  if (!code) {
    return res.sendStatus(400);
  }
  try {
    console.log('/done', code, GOOGLE_ID, GOOGLE_SECRET, redirectUri);
    const accessToken = await getAccessToken({
      code,
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      redirectUri: `${redirectUri}done`
    });

    console.log('accessToken', accessToken);

    const profile = await getProfile(accessToken);

    res.redirect('http://localhost:3000');
  } catch (err) {
    console.error('ERROR', err);
    res.sendStatus(500);
  }
});

export default oAuth;