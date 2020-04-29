import channelModel from '../models/Channel';
import * as constants from "../helpers/constants";
import workspaceModel from "../models/Workspace";

exports.getPermissions = (operationType) => {
    switch (operationType) {
        case 'get' : return constants.CHANNEL_OPERATION_PERMISSIONS.GET;
        case 'update' : return constants.CHANNEL_OPERATION_PERMISSIONS.UPDATE;
        case 'delete' : return constants.CHANNEL_OPERATION_PERMISSIONS.DELETE;
        // case 'addUser': return constants.WORKSPACE_OPERATION_PERMISSIONS.ADD_USER;
        default: return [];
    }
};
exports.createChannel = (params) => {

    let channel = new channelModel({
        name: params.name,
        owner: params.user._id,
        members: { role: params.role, user: params.user._id },
        isDefault: params.isDefault || false,
        workspaceId: params.workspaceId || null,
    });

    return channel.save();
};

exports.findChannel = (query) => {
    return channelModel.findOne(query).then(channel => {
        if (!channel) {
            return { success: false };
        }
        return { success: true };
    }).catch(err => {
        return { success: false, error: err };
    });
};

exports.getChannel = (query) => {
    return channelModel.findOne(query).populate('members.user', '_id email imageUrl fullName sLoggedIn lastLogin');
};

exports.updateChannel = (query, attributes) => {
    return channelModel.findOneAndUpdate(query, attributes, { new: true }).then(result => {
        if (!result) {
            return { success: false };
        }

        return { success: true, channel: result };
    }).catch(err => {
        return { success: false, error: err }
    });
};

exports.deleteChannel = (cid, workspaceId) => {
    return channelModel.deleteOne({_id: cid, workspaceId}).then((result) => {
        if (result.deletedCount === 0) {
            return { success: false, error: constants.COULDNT_DELETE_CHANNEL };
        }
        return { success: true };
    }).catch(err => {
        return { success: false, error: err };
    });
};

exports.addUserInChannel = (query, userId) => {
    let newMember = {
        role: 'member',
        user: userId
    };
    return channelModel.update(query, {
        $push: {
            members: newMember
        }
    }).then(result => {
        if (result.nModified === 0) {
            return { success: false, error: constants.SOMETHING_WENT_WRONG };
        }

        return { success: true }
    }).catch(err => {
        return { success: false, error: err };
    });
};
