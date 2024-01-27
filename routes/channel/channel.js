import express from 'express';
import passport from 'passport';

import * as channel from './channel.controller';
import * as validateWithJoi from '../../middlewares/joiVerify';
import workspaceCredentials from '../../middlewares/checkCredentials/workspace';
import checkCredentials from '../../middlewares/checkCredentials/channel';

const router = express.Router();


router.post('/', passport.authenticate('jwt', { session: false }), validateWithJoi.createChannel, workspaceCredentials('createChannel'), channel.create);
router.get('/:channelId', passport.authenticate('jwt', { session: false }), validateWithJoi.getChannel, checkCredentials('get'), channel.get);
router.patch('/:channelId', passport.authenticate('jwt', { session: false }), validateWithJoi.updateChannel, checkCredentials('update'), channel.update);
router.delete('/:channelId', passport.authenticate('jwt', { session: false }), validateWithJoi.deleteChannel, checkCredentials('delete'), channel.delete);
// TODO get all channels in current workspace where user is exists

router.post('/:channelId/add-user', passport.authenticate('jwt', { session: false }), validateWithJoi.addUserToChannel, checkCredentials('addUser'), channel.addUser);
router.delete('/:channelId/remove-user', passport.authenticate('jwt', { session: false }), validateWithJoi.removeUserFromChannel, checkCredentials('removeUser'), channel.removeUser);

// leave member from channel
router.delete('/:channelId/leave', passport.authenticate('jwt', { session: false }), validateWithJoi.leaveFromChannel, checkCredentials('leave'), channel.leaveChannel);

export default router;
