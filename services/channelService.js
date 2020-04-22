import channelModel from '../models/Channel';
import * as constants from "../helpers/constants";
import workspaceModel from "../models/Workspace";

exports.getPermissions = (operationType) => {
    switch (operationType) {
        case 'get' : return constants.CHANNEL_OPERATION_PERMISSIONS.GET;
        case 'update' : return constants.CHANNEL_OPERATION_PERMISSIONS.UPDATE;
        case 'delete' : return constants.CHANNEL_OPERATION_PERMISSIONS.DELETE;
        // case 'addUser': return constants.WORKSPACE_OPERATION_PERMISSIONS.ADD_USER;
        // case 'createChannel': return constants.WORKSPACE_OPERATION_PERMISSIONS.CREATE_CHANNEL;
        default: return [];
    }
};
exports.createChannel = (name, user, role, isDefault = false) => {
    let channel = new channelModel({
        name,
        owner: user._id,
        members: { role: role, user: user._id },
        isDefault: isDefault
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

exports.deleteChannel = (cid) => {
    return channelModel.deleteOne({_id: cid}).then((result) => {
        if (result.deletedCount === 0) {
            return { success: false, error: constants.COULDNT_DELETE_CHANNEL };
        }
        return { success: true };
    }).catch(err => {
        return { success: false, error: err };
    });
};
