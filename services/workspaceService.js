import workspaceModel from '../models/Workspace';
import channelModel from '../models/Channel';
import * as constants from '../helpers/constants';

exports.getPermissions = (operationType) => {
    switch (operationType) {
        case 'get' : return constants.WORKSPACE_OPERATION_PERMISSIONS.GET;
        case 'update' : return constants.WORKSPACE_OPERATION_PERMISSIONS.UPDATE;
        case 'delete' : return constants.WORKSPACE_OPERATION_PERMISSIONS.DELETE;
        case 'addUser': return constants.WORKSPACE_OPERATION_PERMISSIONS.ADD_USER;
        case 'createChannel': return constants.WORKSPACE_OPERATION_PERMISSIONS.CREATE_CHANNEL;
        default: return [];
    }
};

exports.findWorkspace = (query) => {
    return workspaceModel.findOne(query).then(workspace => {
       if (!workspace) {
           return { success: false };
       }
       return { success: true };
    }).catch(err => {
        return { success: false, error: err };
    });

};

exports.createWorkspace = (name, user, role, channel) => {
    let workspace = new workspaceModel({
        name,
        owner: user._id,
        members: { role: role, user: user._id },
        channel: channel._id
    });

    return workspace.save();
};

exports.getWorkspace = (query) => {
  return workspaceModel.findOne(query)
      .populate('members.user', '_id email fullName isLoggedIn lastLogin imageUrl')
      .populate('channel', '_id name');
};

exports.updateWorkspace = (query, attributes) => {
    return workspaceModel.findOneAndUpdate(query, attributes, { new: true }).then(result => {
        if (!result) {
            return { success: false };
        }

        return { success: true, workspace: result };
    }).catch(err => {
        return { success: false, error: err }
    });
};

exports.deleteWorkspace = (wid) => {
    return new Promise(resolve => {
        workspaceModel.findById(wid, (err, workspace) => {
            channelModel.remove({
                "_id": {
                    $in: workspace.channel
                }
            }, err => {
                if (err) {
                    let err = { success: false, message: err };
                    resolve(err);
                }
                workspace.remove();
                let success = { success: true };
                resolve(success);
            });
        });
    });
};


exports.addUserInWorkspace = (role, userId, workspaceId) => {
    let newMember = {
      role: role || 'member',
      user: userId
    };
    return workspaceModel.update({ _id: workspaceId }, {
        $push: {
            members: newMember
        }
    }).then((result) => {
        if (result.nModified === 0) {
            return { success: false, error: constants.COULDNT_ADD_USER_TO_THE_WORKSPACE };
        }

        return { success: true }
    }).catch(err => {
        return { success: false, error: err };
    });
};

exports.addChannelInWorkspace = (workspaceId, channelId) => {
    return workspaceModel.update({ _id: workspaceId }, {
        $push: {
            channel: channelId
        }
    }).then((result) => {
        if (result.nModified === 0) {
            return { success: false, error: constants.COULDNT_ADD_CHANNEL_TO_THE_WORKSPACE };
        }

        return { success: true }
    }).catch(err => {
        return { success: false, error: err };
    });
};

exports.deleteChannelFromWorkspace = (workspaceId, channelId) => {
    return workspaceModel.update({ _id: workspaceId }, {
        $pull: {
            channel: channelId
        }
    }).then((result) => {
        if (result.nModified === 0) {
            return { success: false, error: constants.COULDNT_DELETE_CHANNEL_FROM_WORKSPACE };
        }

        return { success: true }
    }).catch(err => {
        return { success: false, error: err };
    });

};
