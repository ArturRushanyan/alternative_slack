import express from 'express';
import passport from 'passport';
import Authentiaction from './authentication.controller';

const router = express.Router();

router.post('/signup', Authentiaction.SignUp);
router.post('/login', Authentiaction.Login);
router.get('/logout', passport.authenticate('jwt', { session: false }), Authentiaction.Logout);
router.post('/reset-password', Authentiaction.resetPassword);
router.post('/reset-password/confirm/:token', Authentiaction.resetPasswordConfirmation);

export default router;
