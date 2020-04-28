import express from 'express';
import passport from 'passport';

import * as user from './user.controller';
import * as validateWithJoi from "../../middlewares/joiVerifay";
import uploadImage from '../../middlewares/uploadImage';

const router = express.Router();

router.get('/me', passport.authenticate('jwt', { session: false }), user.get);
router.patch('/me', passport.authenticate('jwt', { session: false }), validateWithJoi.updateUser, user.update);
router.post('/me/image', passport.authenticate('jwt', { session: false }), uploadImage.single('image'), user.uploadImage);
router.delete('/me/image', passport.authenticate('jwt', { session: false }), user.deleteImage);

export default router;
