import workspaceModel from '../models/Workspace';
import { WORKSPACE_OPERATION_PERMISSIONS } from '../helpers/constants';

exports.getPermissions = (operationType) => {
    switch (operationType) {
        case 'get' : return WORKSPACE_OPERATION_PERMISSIONS.GET;
        case 'update' : return WORKSPACE_OPERATION_PERMISSIONS.UPDATE;
        case 'delete' : return WORKSPACE_OPERATION_PERMISSIONS.DELETE;
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

exports.createWorkspace = (name, user, role) => {
    let attributes = new workspaceModel({
        name,
        owner: user._id,
        members: { role: role, user: user._id }
    });

    return attributes.save();
};

exports.getWorkspace = (query) => {
  return workspaceModel.findOne(query).populate('members.user', '_id email fullName isLoggedIn lastLogin imageUrl');
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

exports.getUserFromMembers = (userId, members) => {
    let currentMember = null;
        members.forEach(item => {
        if (userId == item.user._id) {
            currentMember = item;
        }
    });
    return new Promise(resolve => {
        if (!currentMember) {
            resolve(currentMember);
        }
        resolve(currentMember);
    });
};

exports.deleteWorkspace = (wid) => {
    return workspaceModel.deleteOne({_id: wid}).then((result) => {
        if (result.deletedCount <= 0) {
            return { success: false, error: 'can\'t delete workspace' };
        }
        return { success: true };
    }).catch(err => {
        return { success: false, error: err };
    })
};
