import Error from '../../helpers/Error';

import * as workspaceService from '../../services/workspaceService';

export default (operationType) => {
    return (req, res, next) => {
        const { workspaceId } = req.params;
        const { id } = req.user;

        workspaceService.getWorkspace({ _id: workspaceId }).then((workspace) => {
            if (!workspace) {
                throw {status: 404, message: `workspace with id '${workspaceId}' doesn't exists`};
            }

            return workspaceService.getUserFromMembers(id, workspace.members);
        }).then(member =>{
            if (!member) {
                throw { status: 400, message: 'Permission Denied' }
            }

            if (!workspaceService.getPermissions(operationType).includes(member.role)) {
                throw { status: 400, message: 'Permission Denied' };
            }

            next();
        }).catch(err => {
            return Error.errorHandler(res, err.status, err.message);
        })
    };
};