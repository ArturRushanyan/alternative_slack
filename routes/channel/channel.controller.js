import Error from '../../helpers/Error';
import * as util from '../../helpers/utils';
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
import * as messagesService from '../../services/messageService';

exports.create = (req, res) => {
    const { name, workspaceId } = req.body;
    const { user } = req;
    let channel;

    channelService.findChannel({ name, workspaceId }).then((channel) => {
        if (channel.success) {
            throw { status: 400, message: ALREADY_EXISTS(`channel with ${name} name is`) };
        } else if (!channel.success && channel.error) {
            throw { status: 500, message: channel.error};
        }

        const params = {
            name,
            user,
            role: CHANNEL_USERS_ROLES.OWNER,
            workspaceId,
            messages: null
        };

        return channelService.createChannel(params);
    }).then((createdChannel) => {
        if (!createdChannel.success) {
            throw { status: 500, message: createdChannel.error || SOMETHING_WENT_WRONG };
        }
        channel = createdChannel;

        return messagesService.initializeChannelMessages(channel);
    }).then(initializedMessage => {
        // if () {
        //
        // }
        console.log('initializedMessage =>>>', initializedMessage);
        // const attributes = {
        //     messages: initializedMessage,
        // };

        return channelService.updateChannel({_id: channel._id}, attributes);
    }).then(aa => {

        return workspaceService.addChannelInWorkspace(workspaceId, createdChannel._id);
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
        if (!result.success) {
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

        // check the user is member of the current workspace
        return util.getUserFromMembers(targetUser, result.workspace.members);
    }).then(result => {
        if (!result) {
            throw { status: 400, message: NOT_EXISTS('User in workspace') }
        }

        // check the user is member of the current channel
        return util.getUserFromMembers(targetUser, req.channel.members);
    }).then(result => {
        if (!!result) {
            throw { status: 409, message: ALREADY_EXISTS('User in the channel') };
        }

        return channelService.addUserInChannel({ _id: channelId }, targetUser);
    }).then(result => {
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

    // check the user is member of the current channel
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

    // check the user is member of the current channel
    util.getUserFromMembers(user._id, req.channel.members).then(result => {
        if (!result) {
            throw { status: 400, message: PERMISSION_DENIED };
        }

        if (channel.owner == user._id) {
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
