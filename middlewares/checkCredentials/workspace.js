import Error from '../../helpers/Error';
import * as constants from '../../helpers/constants';
import * as util from '../../helpers/utils';

import * as workspaceService from '../../services/workspaceService';

const getParam = (req) =>  {
    if (req.params.workspaceId) {
        return req.params.workspaceId;
    }
    if (req.body.workspaceId) {
        return req.body.workspaceId
    }
};

export default (operationType) => {
    return (req, res, next) => {
        const workspaceId = getParam(req);
        const { id } = req.user;
        let workspaceData;

        workspaceService.getWorkspace({ _id: workspaceId }).then((workspace) => {
            if (!workspace) {
                throw {status: 404, message: constants.WORKSPACE_DOES_NOT_EXIST(workspaceId) };
            }
            workspaceData = workspace;
            return util.getUserFromMembers(id, workspace.members);
        }).then(member =>{
            if (!member) {
                throw { status: 400, message: constants.PERMISSION_DENIED }
            }

            if (!workspaceService.getPermissions(operationType).includes(member.role)) {
                throw { status: 400, message: constants.PERMISSION_DENIED };
            }
            req.workspace = workspaceData;
            next();
        }).catch(err => {
            return Error.errorHandler(res, err.status, err.message);
        })
    };
};
