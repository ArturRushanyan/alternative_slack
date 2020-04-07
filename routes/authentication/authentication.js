import express from 'express';
import Authentiaction from './authentication.controller';

const router = express.Router();

router.post('/signup', Authentiaction.SignUp);
router.post('/login', Authentiaction.Login);


export default router;
