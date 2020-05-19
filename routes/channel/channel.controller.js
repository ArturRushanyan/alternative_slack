import Error from '../../helpers/Error';
import {
    ALREADY_EXISTS,
    CHANNEL_USERS_ROLES,
    PERMISSION_DENIED,
    SOMETHING_WENT_WRONG,
    NOT_EXISTS,
    WORKSPACE_DOES_NOT_EXIST,
    USER_SUCCESSFULLY_ADD,
    SUCCESS_DELETED_USER_FROM_CHANNEL,
    OWNER_CAN_NOT_LEAVE_FROM_CHANNEL,
} from '../../helpers/constants';

import * as channelService from '../../services/channelService';
import * as workspaceService from '../../services/workspaceService';
import * as util from '../../helpers/utils';


exports.create = (req, res, next) => {
    const { name, workspaceId } = req.body;
    const { user } = req;
    let createdChannel;

    channelService.findChannel({ name, workspaceId }).then((channel) => {
        if (channel.success) {
            throw { status: 400, message: ALREADY_EXISTS(`channel with ${name} name is`) };
        } else if (!channel.success && channel.error) {
            throw { status: 500, message: channel.error};
        }
        let params = {
            name,
            user,
            role: CHANNEL_USERS_ROLES.OWNER,
            workspaceId
        };

        return channelService.createChannel(params);
    }).then((channel) => {
        if (!channel) {
            throw {status: 500, message: SOMETHING_WENT_WRONG}
        }
        createdChannel = channel;

        return workspaceService.addChannelInWorkspace(workspaceId, channel._id);
    }).then((result) => {
        if (!result.success) {
            throw { status: 400, message: result.err || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true , channel: createdChannel });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};

exports.get = (req, res, next) => {
    const channel = req.channel;
    if (!channel) {
        return Error.errorHandler(res, 400, SOMETHING_WENT_WRONG);
    }
    res.status(200).json({ channel });
};

exports.update = (req, res, next) => {
    const { name } = req.body;
    const { channelId } = req.params;

    const attributes = {
        name,
    };

    channelService.updateChannel({ _id: channelId }, attributes).then(result => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG }
        }

        return res.status(200).json({ success: true, channel: result.channel });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};

exports.delete = (req, res, next) => {
    const { channelId } = req.params;
    const { workspaceId } = req.body;

    if (req.channel.isDefault) {
        return Error.errorHandler(res, 400, PERMISSION_DENIED);
    }

    channelService.deleteChannel(channelId, workspaceId).then(result => {
        if (!result.success) {
            throw {status: 500, message: result.error || SOMETHING_WENT_WRONG};
        }

        return workspaceService.deleteChannelFromWorkspace(workspaceId, channelId);
    }).then((result) => {
        if (!result.success || result.error) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true });
    }).catch(err => {
       return Error.errorHandler(res, err.status, err.message);
    });
};

exports.addUser = (req, res, next) => {
    const { channelId } = req.params;
    const targetUser = req.body.userId;
    const { workspaceId } = req.channel;

    return workspaceService.findWorkspace({ _id: workspaceId }).then(result => {
        if (!result.success) {
            throw { status: 404, message: WORKSPACE_DOES_NOT_EXIST(workspaceId) }
        }

        return util.getUserFromMembers(targetUser, result.workspace.members);
    }).then(result => {
        if (!result) {
            throw { status: 400, message: NOT_EXISTS('User in workspace') }
        }

        return util.getUserFromMembers(targetUser, req.channel.members);
    }).then(result => {
        if (!!result) {
            throw { status: 409, message: ALREADY_EXISTS('User in the channel') };
        }

        return channelService.addUserInChannel({ _id: channelId }, targetUser);
    }).then(result => {
        console.log('result =>>>', result);
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true, message: USER_SUCCESSFULLY_ADD });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    });
};

exports.removeUser = (req, res, next) => {
    const { channelId } = req.params;
    const targetUser = req.body.userId;

    util.getUserFromMembers(targetUser, req.channel.members).then(result => {
        if (!result) {
            throw { status: 409, message: NOT_EXISTS('User in the channel') };
        }

        return channelService.deleteUserFromChannel({ _id: channelId }, req.user._id);
    }).then(result => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true, message: SUCCESS_DELETED_USER_FROM_CHANNEL });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};

exports.leaveChannel = (req, res, next) => {
    const { channelId } = req.params;
    const { user, channel } = req;

    util.getUserFromMembers(user._id, req.channel.members).then(result => {
        if (!result) {
            throw { status: 400, message: PERMISSION_DENIED };
        }

        if (channel.owner.toString() === user._id.toString()) {
            throw { status: 400, message: OWNER_CAN_NOT_LEAVE_FROM_CHANNEL };
        }

        return channelService.deleteUserFromChannel({ _id: channelId }, user._id);
    }).then(result => {
        if (!result.success) {
            throw { status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        return res.status(200).json({ success: true });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    });
};
