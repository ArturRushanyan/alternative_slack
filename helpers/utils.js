
exports.getUserFromMembers = (userId, members) => {
    let currentMember = null;
    members.forEach(item => {
        if (userId.toString() === item.user._id.toString()) {
            return currentMember = item;
        }
    });
    return new Promise(resolve => {
        return resolve(currentMember);
    });
};
