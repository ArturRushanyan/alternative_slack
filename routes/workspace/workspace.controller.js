import Error from '../../helpers/Error';
import * as util from '../../helpers/utils';

import {
    CHANNEL_USERS_ROLES,
    ALREADY_EXISTS,
    NOT_EXISTS,
    SOMETHING_WENT_WRONG,
    WORKSPACE_DOES_NOT_EXIST,
    USER_SUCCESSFULLY_ADD,
    DEFAULT_AVATAR_IMAGE,
    DEFAULT_WORKSPACE_LOGO,
    CAN_NOT_CHANGE_YOURSELF_ROLE,
    PERMISSION_DENIED,
    CANNOT_DELETE_YOURSELF_FROM_WORKSPACE,
} from '../../helpers/constants';

// Services
import * as userService from '../../services/userService';
import * as workspaceService from '../../services/workspaceService';
import * as channelService from '../../services/channelService';
import * as userWorkspaceService from '../../services/userWorkspaceService';



exports.create = (req, res, next) => {
    const { user } = req;
    const name = req.body.name;
    let workspace;
    let channel;

    workspaceService.findWorkspace({ name: name}).then((workspace) => {
        if (!workspace.success && workspace.error) {
            throw {status: 500, message: workspace.error};
        } else if (workspace.success) {
            throw {status: 409, message: ALREADY_EXISTS('workspace with current name')};
        }
        let params = {
            name: 'general',
            user,
            role: CHANNEL_USERS_ROLES.OWNER,
            isDefault: true
        };
        return channelService.createChannel(params);
    }).then((createdChannel) => {
        if (!createdChannel) {
            throw { status: 500, message: SOMETHING_WENT_WRONG };
        }
        channel = createdChannel;

        return workspaceService.createWorkspace(name, user, 'owner', createdChannel);
    }).then((result) => {
        if (!result) {
            throw { status: 500, message: SOMETHING_WENT_WRONG }
        }
        workspace = result;

        return userWorkspaceService.addUserWorkspace(user, workspace._id);
    }).then((result) => {
        if (!result.success) {
            throw {status: 500, message: result.error};
        }
        return channelService.updateChannel({ _id: channel._id }, { workspaceId: workspace._id });
    }).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true , workspace });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    });
};

exports.get = (req, res, next) => {
    const { workspaceId } = req.params;

    workspaceService.getWorkspace({ _id: workspaceId }).then((workspace) => {
        if (!workspace) {
            throw { status: 404, message: WORKSPACE_DOES_NOT_EXIST(workspaceId) };
        }

        return  res.status(200).json({ workspace });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    });
};

exports.update = (req, res, next) => {
    const { workspaceId } = req.params;
    const { name } = req.body;

    const attributes = {
        name,
    };

    workspaceService.getWorkspace({ _id: workspaceId }).then((result) => {
        if (!result) {
            throw {status: 404, message: WORKSPACE_DOES_NOT_EXIST(workspaceId)}
        }

        return workspaceService.updateWorkspace({_id: workspaceId}, attributes);
    }).then((updatedWorkspace) => {

        if (!updatedWorkspace.success || updatedWorkspace.err) {
            throw { status: 500, message: updatedWorkspace.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({
            success: true,
            workspace: updatedWorkspace.workspace
        });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    });
};

exports.delete = (req, res, next) => {
    const { workspaceId } = req.params;
    userWorkspaceService.deleteUserWorkspace(req.workspace).then(result => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }
        return workspaceService.deleteWorkspace(workspaceId);
    }).then((result) => {
        if (!result.success || result.err) {
            throw { status: 500, message: result.err || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    });
};

exports.addUser = (req, res, next) => {
    const { workspaceId } = req.params;
    const { email } = req.body;
    const { role } = req.body;
    let targetUser;

    userService.findUserByEmail(email).then((user) => {
        if (!user) {
            throw { status: 404, message: NOT_EXISTS(`user with ${email}`) }
        }
        targetUser = user;

        return util.getUserFromMembers(user._id, req.workspace.members);
    }).then((member) =>{
        if (member) {
            throw { status: 409, message: `user with ${email} exists in the current workspace` };
        }

        return workspaceService.addUserInWorkspace(role, targetUser._id, workspaceId);
    }).then((result) => {
        if (!result.success) {
            throw {status: 400, message: result.err || SOMETHING_WENT_WRONG};
        }
        return userWorkspaceService.addUserWorkspace(targetUser, workspaceId);
    }).then((result) => {
        if (!result.success) {
            throw {status: 500, message: result.error || SOMETHING_WENT_WRONG};
        }

        return channelService.addUserInChannel({ workspaceId, isDefault: true }, targetUser._id);
    }).then(() => {
        return res.status(200).json({ success: true, message: USER_SUCCESSFULLY_ADD });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};

exports.updateImage = (req, res, next) => {
    util.deleteImage(req.workspace.imageUrl).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }
        return workspaceService.updateWorkspaceLogo(req.workspace, req.file.path);
    }).then(result => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true, workspace: result.workspaceData });
    }).catch(err => {
        utils.deleteImage(req.file.path);
        return Error.errorHandler(res, err.status, err.message);
    });
};

exports.deleteImage = (req, res, next) => {
    util.deleteImage(req.workspace.imageUrl).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }
        return workspaceService.updateWorkspaceLogo(req.workspace, DEFAULT_WORKSPACE_LOGO);
    }).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true, user: result.userData });
    }).catch(err => {
        util.deleteImage(req.file.path);
        return Error.errorHandler(res, err.status, err.message || err);
    })
};

exports.updateUserRole = (req, res, next) => {
    const { workspaceId } = req.params;
    let targetUser = req.body.userId;
    const { user } = req;
    const { role } = req.body;

    if (targetUser == user._id) {
        return Error.errorHandler(res, 400, CAN_NOT_CHANGE_YOURSELF_ROLE);
    }
    util.getUserFromMembers(targetUser, req.workspace.members).then(member => {
        if (!member) {
            throw {status: 404, message: NOT_EXISTS('In workspace current user')};
        }
        targetUser = member;
        if ((user.role === 'admin' && targetUser.role === 'owner') || (user.role !== 'owner' && role === 'owner')) {
            throw {status: 400, message: PERMISSION_DENIED};
        }

        return workspaceService.updateUserRoleInWorkspace(workspaceId, targetUser.user._id, role);
    }).then(result => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    });

};

exports.removeUser = (req, res, next) => {
    const { workspaceId } = req.params;
    let targetUser = req.body.userId;
    const { user } = req;

    if (targetUser == user._id) {
        return Error.errorHandler(res, 400, CANNOT_DELETE_YOURSELF_FROM_WORKSPACE);
    }
    util.getUserFromMembers(targetUser, req.workspace.members).then((member) => {
        if (!member) {
            throw {status: 404, message: NOT_EXISTS('In workspace current user')};
        }
        targetUser = member;

        if (user.role === 'admin' && targetUser.role === 'owner') {
            throw {status: 400, message: PERMISSION_DENIED};
        }
        return userWorkspaceService.removeWorkspaceFromUserWorkspaceList(targetUser.user._id, workspaceId);
    }).then(result => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return channelService.deleteUserFromWorkspaceAllChannels(workspaceId, targetUser.user._id);
    }).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return workspaceService.deleteUserFromWorkspace(workspaceId, targetUser.user._id);
    }).then((result) => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true, message: 'user successfully deleted' });
    }).catch(err => {
       return Error.errorHandler(res, err.status, err.message);
    });
};
