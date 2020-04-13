import mongoose from 'mongoose';
import { INVITE_USER_REASON, PASSWORD_RESET_REASON } from '../helpers/constants';

const Schema = mongoose.Schema;
const tokenId = mongoose.Schema.Types.ObjectId;

const tokenSchema = new Schema({
    token: {
        type: String,
    },
    expiration: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reason: {
      type: String,
      enum: [ INVITE_USER_REASON, PASSWORD_RESET_REASON ],
    },
});

let Token = null;

try {
    Token = mongoose.model('Token', tokenSchema);
} catch(e) {
    Token = mongoose.model('Token')
}

module.exports = Token;
