import express from 'express';
import passport from 'passport';
import * as authentiaction from './authentication.controller';
import * as validateWithJoi from '../../middlewares/joiVerify';

const router = express.Router();

router.post('/signup', validateWithJoi.Registration, authentiaction.SignUp);
router.post('/login', validateWithJoi.Login, authentiaction.Login);
router.get('/logout', passport.authenticate('jwt', { session: false }), authentiaction.Logout);
router.post('/reset-password', validateWithJoi.resetPassword, authentiaction.resetPassword);
router.post('/reset-password/confirm/:token', validateWithJoi.resetPasswordConfirmation, authentiaction.resetPasswordConfirmation);

export default router;
