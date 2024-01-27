import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userWorkspaceSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    workspaces: [{
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
    }]
});

let userWorkspaces = null;

try {
    userWorkspaces = mongoose.model('userWorkspaces', userWorkspaceSchema);
} catch (err) {
    userWorkspaces = mongoose.model('userWorkspaces');
}

module.exports = userWorkspaces;
