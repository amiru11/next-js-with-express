import './env';
import express from 'express';
import next from 'next';

import oAuth from './routes/oauth';
import './lib/aws';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();


app.prepare().then(() => {
  const server: express.Application = express();

  server.use('/oauth', oAuth);
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> ✨ Ready on http://localhost:${port}`);
  });
});
