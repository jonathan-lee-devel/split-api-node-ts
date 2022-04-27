import {Router} from 'express';
import passport from 'passport';

export const configureGetGoogleAuthCallbackRoute = (
    router: Router,
) => {
  router.get('/google/callback',
      passport.authenticate('google', {
        failureMessage: true,
        failureRedirect: '/login',
      }),
      (req, res) => {
        res.redirect(`${process.env.FRONT_END_URL}/login/auth/google`);
      });
};