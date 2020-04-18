//Error
import Error from '../../helpers/Error';

// Services
import * as userService from '../../services/userService';
import * as workspaceService from '../../services/workspaceService';

exports.create = (req, res, next) => {
    const { user } = req;
    const name = req.body.name;

    userService.findUserByEmail(user.email).then((user) => {
        if (!user) {
            throw { status: 400, message: 'user doesn\'t exists'};
        }

        return workspaceService.findWorkspace({ name: name });
    }).then((workspace) => {
        if (!workspace.success && workspace.error) {
            throw { status: 500, message: workspace.error };
        } else if (workspace.success) {
            throw { status: 409, message: 'workspace with current name already exists' }
        }

        return workspaceService.createWorkspace(name, user, 'owner');
    }).then((workspace) => {
        if (!workspace) {
            throw { status: 500, message: 'something went wrong' }
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
            throw { status: 404, message: `workspace with id '${workspaceId}' doesn't exists` };
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
            throw {status: 404, message: 'couldn\'t find a workspace'}
        }

        return workspaceService.updateWorkspace({_id: workspaceId}, attributes);
    }).then((updatedWorkspace) => {

        if (!updatedWorkspace.success || updatedWorkspace.err) {
            throw { status: 500, message: updatedWorkspace.error || 'something went wrong' };
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
            throw { status: 400, message: result.err || 'something went wrong' };
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
            throw { status: 404, message: `user with ${email} doesn't exists` }
        }
        targetUser = user;
        return workspaceService.getUserFromMembers(user._id, req.workspace.members);
    }).then((member) =>{
        if (member) {
            throw { status: 409, message: `user with ${email} exists in the current workspace` };
        }

        return workspaceService.addUserInWorkspace(role, targetUser._id, workspaceId);
    }).then((result) => {
        if (!result.success || result.err) {
            throw { status: 400, message: result.err || 'something went wrong' };
        }

        return res.status(200).json({ success: true, message: 'user successfully added to the workspace' });
    }).catch(err => {
        return Error.errorHandler(res, err.status, err.message);
    })
};
