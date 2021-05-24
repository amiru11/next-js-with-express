import express from 'express';
import next from 'next';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

console.log('process.env', process.env);
// passport.use(new Strategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:3000/oauth/authorized"
// },
// function(accessToken, refreshToken, profile, cb) {
//   console.log('accessToken::: ', accessToken)
//   console.log('refreshToken::: ', refreshToken)
//   console.log('profile::: ', profile)
//   console.log('cb::: ', cb)
// }
// ));

// app.prepare().then(() => {
//   const server: express.Application = express();
//   // GET /auth/google
//   //   Use passport.authenticate() as route middleware to authenticate the
//   //   request.  The first step in Google authentication will involve
//   //   redirecting the user to google.com.  After authorization, Google
//   //   will redirect the user back to this application at /auth/google/callback
//   server.get('/:country/oauth/authorize', passport.authenticate('google', { scope: 'email' }));

//   // GET /auth/google/callback
//   //   Use passport.authenticate() as route middleware to authenticate the
//   //   request.  If authentication fails, the user will be redirected back to the
//   //   login page.  Otherwise, the primary route function function will be called,
//   //   which, in this example, will redirect the user to the home page.
//   server.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });
//   server.get('*', (req, res) => {
//     return handle(req, res);
//   });
  
  
//   server.listen(port, () => {
//     console.log(`> ✨ Ready on http://localhost:${port}`);
//   });
// });