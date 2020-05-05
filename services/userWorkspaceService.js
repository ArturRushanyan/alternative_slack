import userWorkspaceModel from '../models/userWorkspaces';
import * as constants from "../helpers/constants";

exports.createUserWorkspace = (userId) => {
    let data = new userWorkspaceModel({
        userId: userId
    });

    return data.save();
};

exports.getUserWorkspaces = (userId) => {
    return userWorkspaceModel.findOne({ userId }).populate('workspaces', '_id name imageUrl owner');
};

exports.addUserWorkspace = (user, workspaceId) => {
    return userWorkspaceModel.findOneAndUpdate({ 'userId': user._id }, {
        $push: {
            workspaces: workspaceId
        }
    }, { new: true }).then((result) => {
        if (result.nModified === 0) {
            return { success: false, error: constants.SOMETHING_WENT_WRONG };
        }

        return { success: true }
    }).catch(err => {
        return { success: false, error: err };
    });
};


exports.deleteUserWorkspace = (workspace) => {
    return userWorkspaceModel.update({},
        { $pull: { workspaces: { $in: workspace._id  } } },
        { multi: true },
    ).then((result) => {
        if (result.nModified === 0) {
            return { success: false, error: constants.COULDNT_DELETE_WORKSPACE };
        }

        return { success: true }
    }).catch(err => {
        return { success: false, error: err };
    });
};

exports.removeWorkspaceFromUserWorkspaceList = (userId, workspaceId) => {
      return userWorkspaceModel.update({ userId },
          { $pull: { workspaces: workspaceId } },
          { new: true }
      ).then((result) => {
          if (result.nModified === 0) {
              return { success: false, error: constants.COULDNT_DELETE_WORKSPACE };
          }

          return { success: true }
      }).catch(err => {
          return { success: false, error: err };
      });


};
