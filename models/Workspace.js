import mongoose from 'mongoose';
import {DEFAULT_WORKSPACE_LOGO, WORKSPACE_USERS_ROLES } from '../helpers/constants';

const Schema = mongoose.Schema;

const workspaceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        role: {
            type: String,
            enum: [WORKSPACE_USERS_ROLES.ADMIN, WORKSPACE_USERS_ROLES.MEMBER, WORKSPACE_USERS_ROLES.OWNER]
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    }],
    channel: [{
       type: Schema.Types.ObjectId,
       ref: 'Channel',
       required: true,
    }],
    imageUrl: {
        type: String,
        default: DEFAULT_WORKSPACE_LOGO,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

let Workspace = null;

try {
    Workspace = mongoose.model('Workspace', workspaceSchema);
} catch (err) {
    Workspace = mongoose.model('Workspace');
}

module.exports = Workspace;
