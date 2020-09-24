import messagesModel from '../models/Messages';

exports.initializeChannelMessages = (channel) => {
    let initMessage = new messagesModel({
        channelId: channel._id,
        messages: {
            senderId: null,
            message: `Welcome to ${channel.name} channel`,
            createdAt: Date.now()
        }
    });

    return initMessage.save().then(result => {
        if (!result) {
            return { success: false };
        }
        return { success: true, result };
    }).catch(err => {
        return { success: false, error: err };
    });
};
