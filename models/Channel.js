import mongoose from 'mongoose';
import { CHANNEL_USERS_ROLES } from '../helpers/constants';

const Schema = mongoose.Schema;

const channelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        role: {
            type: String,
            enum: [CHANNEL_USERS_ROLES.OWNER, CHANNEL_USERS_ROLES.MEMBER]
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    }],
    workspaceId: {
        type: String,
        default: null,
    },
    isDefault: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

let Chanel = null;

try {
    Chanel = mongoose.model('Channel', channelSchema);
} catch (err) {
    Chanel = mongoose.model('Channel');
}

module.exports = Chanel;
