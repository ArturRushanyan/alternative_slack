import express from 'express';
import passport from 'passport';

// middleware
import * as validateWithJoi from '../../middlewares/joiVerifay';
import checkCredentials from '../../middlewares/checkCredentials/workspace';

import * as workspace from './workspace.controller';

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), validateWithJoi.createWorkspace, workspace.create);
router.get('/:workspaceId', passport.authenticate('jwt', { session: false }), validateWithJoi.getWorkspace, checkCredentials('get'), workspace.get);
router.patch('/:workspaceId', passport.authenticate('jwt', { session: false }), validateWithJoi.updateWorkspace, checkCredentials('update'), workspace.update);
router.delete('/:workspaceId', passport.authenticate('jwt', { session: false }), validateWithJoi.deleteWorkspace, checkCredentials('delete'), workspace.delete);

router.post('/:workspaceId/add-user', passport.authenticate('jwt', { session: false }), validateWithJoi.addUserToWorkspace, checkCredentials('addUser'), workspace.addUser);
//need to add a user in the workspace as soon asap

export default router;
