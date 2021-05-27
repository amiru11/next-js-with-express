import './env';
import express from 'express';
import session from 'express-session';
import next from 'next';
import passport from 'passport';

import oAuth from './routes/oauth';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();


app.prepare().then(() => {
  const server: express.Application = express();
  server.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  server.use(passport.initialize());
  server.use(passport.session());

  server.use('/oauth', oAuth);
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> ✨ Ready on http://localhost:${port}`);
  });
});
