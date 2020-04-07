import mongoose from 'mongoose';
import config from '../config';

const Schema = mongoose.Schema;
const userId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    _id: userId,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    imagUrl: {
        type: String,
        default: config.defaultAvatar,
    },
    isLoggedIn: {
        type: Boolean,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

let User = null;

try {
    User = mongoose.model('User', userSchema);
} catch (e) {
    User = mongoose.model('User');
}

module.exports = User;
