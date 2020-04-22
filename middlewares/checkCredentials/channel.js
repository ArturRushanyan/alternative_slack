import Error from '../../helpers/Error';
import * as constants from '../../helpers/constants';
import * as util from '../../helpers/utils';

import * as channelService from '../../services/channelService';
import { PERMISSION_DENIED } from "../../helpers/constants";

const getParam = (req) =>  {
    if (req.params.channelId) {
        return req.params.channelId;
    }
    if (req.body.channelId) {
        return req.body.channelId;
    }
};

export default (operationType) => {
    return (req, res, next) => {
        const channelId = getParam(req);
        const { id } = req.user;
        let channelData;

        channelService.getChannel({ _id: channelId }).then((result) => {
            if (!result) {
                throw { status: 404, message: constants.CHANNEL_DOES_NOT_EXIST(channelId) };
            }

            channelData = result;
            return util.getUserFromMembers(id, result.members);
        }).then(member =>{
            if (!member) {
                throw { status: 400, message: constants.PERMISSION_DENIED }
            }

            if (!channelService.getPermissions(operationType).includes(member.role)) {
                throw { status: 400, message: constants.PERMISSION_DENIED };
            }
            req.channel = channelData;
            next();
        }).catch(err => {
            return Error.errorHandler(res, err.status, err.message);
        })
    };
};
