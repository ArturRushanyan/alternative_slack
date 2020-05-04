import express from 'express';
import passport from 'passport';

// middleware
import * as validateWithJoi from '../../middlewares/joiVerifay';
import checkCredentials from '../../middlewares/checkCredentials/workspace';
import uploadImage from '../../middlewares/uploadImage';

import * as workspace from './workspace.controller';

const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), validateWithJoi.createWorkspace, workspace.create);
router.get('/:workspaceId', passport.authenticate('jwt', { session: false }), validateWithJoi.getWorkspace, checkCredentials('get'), workspace.get);
router.patch('/:workspaceId', passport.authenticate('jwt', { session: false }), validateWithJoi.updateWorkspace, checkCredentials('update'), workspace.update);
router.delete('/:workspaceId', passport.authenticate('jwt', { session: false }), validateWithJoi.deleteWorkspace, checkCredentials('delete'), workspace.delete);

router.post('/:workspaceId/image', passport.authenticate('jwt', { session: false }), validateWithJoi.updateImage, checkCredentials('updateImage'), uploadImage.single('image'), workspace.updateImage);
router.delete('/:workspaceId/image', passport.authenticate('jwt', { session: false }), checkCredentials('deleteImage'), workspace.deleteImage);

router.post('/:workspaceId/add-user', passport.authenticate('jwt', { session: false }), validateWithJoi.addUserToWorkspace, checkCredentials('addUser'), workspace.addUser);
router.patch('/:workspaceId/update-user-role', passport.authenticate('jwt', { session: false }), validateWithJoi.updateUserRole, checkCredentials('updateUserRole'), workspace.updateUserRole);


export default router;
