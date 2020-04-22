import Error from '../../helpers/Error';
import * as util from '../../helpers/utils';

import {
    CHANNEL_USERS_ROLES,
    ALREADY_EXISTS,
    NOT_EXISTS,
    SOMETHING_WENT_WRONG,
    WORKSPACE_DOES_NOT_EXIST,
    USER_SUCCESSFULLY_ADD,
} from '../../helpers/constants';

// Services
import * as userService from '../../services/userService';
import * as workspaceService from '../../services/workspaceService';
import * as channelService from '../../services/channelService';

exports.create = (req, res, next) => {
    const { user } = req;
    const name = req.body.name;

    userService.findUserByEmail(user.email).then((user) => {
        if (!user) {
            throw { status: 400, message: NOT_EXISTS('user') };
        }

        return workspaceService.findWorkspace({ name: name });
    }).then((workspace) => {
        if (!workspace.success && workspace.error) {
            throw {status: 500, message: workspace.error};
        } else if (workspace.success) {
            throw {status: 409, message: ALREADY_EXISTS('workspace with current name')};
        }
        return channelService.createChannel('general', user, CHANNEL_USERS_ROLES.OWNER,true);
    }).then((channel) => {
        if (!channel) {
            throw { status: 500, message: SOMETHING_WENT_WRONG };
        }
        return workspaceService.createWorkspace(name, user, 'owner', channel);
    }).then((workspace) => {
        if (!workspace) {
            throw { status: 500, message: SOMETHING_WENT_WRONG }
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

    return workspaceService.deleteWorkspace(workspaceId).then((result) => {
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
        if (!result.success || result.err) {
            throw { status: 400, message: result.err || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true, message: USER_SUCCESSFULLY_ADD });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};
