import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    channelId: {
        type: String,
        required: true,
    },
    messages: [{
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: true,
        } || null,
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }]
});

let Message = null;

try {
    Message = mongoose.model('Messages', messageSchema);
} catch (err) {
    Message = mongoose.model('Messages');
}

module.exports = Message;
