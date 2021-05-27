import passport from 'passport';
import { Strategy } from 'passport-twitter';
import { redirectUri } from './index';

const { TWITTER_BASE_URL, TWITTER_OAUTH_VERSION, TWITTER_API_KEY, TWITTER_API_SECRET_KEY } = process.env;

// Configure the Twitter strategy for use by Passport.
//
// OAuth 1.0-based strategies require a `verify` function which receives the
// credentials (`token` and `tokenSecret`) for accessing the Twitter API on the
// user's behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
  consumerKey: TWITTER_API_KEY,
  consumerSecret: TWITTER_API_SECRET_KEY,
  callbackURL: `${redirectUri}done`
},
function(token, tokenSecret, profile, cb) {
  console.log('TWITTER token', token);
  console.log('TWITTER tokenSecret', tokenSecret);
  console.log('TWITTER profile', profile);
  // In this example, the user's Twitter profile is supplied as the user
  // record.  In a production-quality application, the Twitter profile should
  // be associated with a user record in the application's database, which
  // allows for account linking and authentication with other identity
  // providers.
  return cb(null, profile);
}));


passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

export default passport;