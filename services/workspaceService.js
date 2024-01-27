import workspaceModel from '../models/Workspace';
import channelModel from '../models/Channel';
import * as constants from '../helpers/constants';
import {
    DEFAULT_WORKSPACE_LOGO,
    OWNER_CAN_NOT_LEAVE_FROM_WORKSPACE,
    SOMETHING_WENT_WRONG,
    WORKSPACE_DOES_NOT_EXIST,
} from "../helpers/constants";
import {} from "../helpers/constants";

function getWorkspaceOwners(wid) {
    const owners = [];
    return workspaceModel.findOne({ _id: wid }).then((result) => {
        result.members.forEach(member => {
            if (member.role === 'owner') {
                owners.push(member);
            }
        });

        return { success: true, owners };
    }).catch(err => {
        return { success: false, error: err };
    });
};

function updateWorkspaceOwner(wid, user, owners) {
    let newOwner;
    owners.forEach(item => {
        if (user._id !== item.user) {
            return newOwner = item.user;
        }
    });

    return workspaceModel.update({ _id: wid },
        { $set: { owner: newOwner }
    }).then(result => {
        if (result.nModified === 0 && result.ok === 0) {
            return { success: false, error: constants.SOMETHING_WENT_WRONG };
        }

        return { success: true };
    }).catch(err => {
        return { success: false, error: err };
    })
}

exports.getPermissions = (operationType) => {
    switch (operationType) {
        case 'get' : return constants.WORKSPACE_OPERATION_PERMISSIONS.GET;
        case 'update' : return constants.WORKSPACE_OPERATION_PERMISSIONS.UPDATE;
        case 'delete' : return constants.WORKSPACE_OPERATION_PERMISSIONS.DELETE;
        case 'addUser': return constants.WORKSPACE_OPERATION_PERMISSIONS.ADD_USER;
        case 'createChannel': return constants.WORKSPACE_OPERATION_PERMISSIONS.CREATE_CHANNEL;
        case 'updateImage': return constants.WORKSPACE_OPERATION_PERMISSIONS.UPDATE_IMAGE;
        case 'deleteImage': return constants.WORKSPACE_OPERATION_PERMISSIONS.DELETE_IMAGE;
        case 'updateUserRole': return constants.WORKSPACE_OPERATION_PERMISSIONS.UPDATE_USER_ROLE;
        case 'removeUser': return constants.WORKSPACE_OPERATION_PERMISSIONS.REMOVE_USER;
        case 'leave': return constants.WORKSPACE_OPERATION_PERMISSIONS.LEAVE_WORKSPACE;
        default: return [];
    }
};

exports.findWorkspace = (query) => {
    return workspaceModel.findOne(query).then(workspace => {
       if (!workspace) {
           return { success: false };
       }

       return { success: true, workspace };
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

    return workspace.save().then((result) => {
        return result;
    });
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
            })
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

exports.deleteUserFromWorkspace = (workspaceId, userId) => {
    return workspaceModel.update(
        { _id: workspaceId },
        { $pull: { members: { 'user': userId }  } },
        { new: true }
    ).then((result) => {
        if (result.nModified === 0 && result.ok === 0) {
            return { success: false, error: constants.SOMETHING_WENT_WRONG };
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

exports.updateWorkspaceLogo = (workspace, path) => {
    if (path !== DEFAULT_WORKSPACE_LOGO) {
        path = '/' + path;
    }
    return workspaceModel.findOneAndUpdate({ _id: workspace._id }, { imageUrl: path }, { new: true }).then(result => {
        if (!result) {
            return { success: false };
        }
        return { success: true, workspaceData: result };
    }).catch(err => {
        return { success: false, error: err }
    });
};

exports.updateUserRoleInWorkspace = (wid, userId, role) => {
    return workspaceModel.update(
        { '_id': wid, 'members.user': userId },
        { $set: { 'members.$.role': role } }
    ).then((result) => {
        if (result.nModified === 0 && result.ok === 0) {
            return { success: false, error: constants.SOMETHING_WENT_WRONG };
        }

        return { success: true }
    }).catch(err => {
        return { success: false, error: err };
    });
};

exports.ownerLeaving = (workspace, user) => {
    let workspaceId = workspace._id;

    return getWorkspaceOwners(workspaceId).then(result => {
        if (!result.success) {
            return { success: false, status: 500, message: result.error || SOMETHING_WENT_WRONG };
        }

        if (result.owners.length === 1) {
           return { success: false, status: 400, error: OWNER_CAN_NOT_LEAVE_FROM_WORKSPACE };
        }

        if (workspace.owner === user._id) {
            return updateWorkspaceOwner(workspaceId, user, result.owners);
        } else {
            return { success: true };
        }
    }).then(result => {
        if (!result.success) return result;

        return { success: true };
    }).catch(err => {
        return { success: false, error: err };
    })
};
