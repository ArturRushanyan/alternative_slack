import userModel from '../models/User';

exports.findUserByEmail = (email) => {
    return userModel.findOne({ email });
};

exports.createUser = (data) => {
    let user = new userModel({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        isLoggedIn: true,
    });

    return user.save();
};

exports.findUserAndUpdate = (query, attributes) => {
    return userModel.findOneAndUpdate(query, attributes, { upsert: true, new: true }).then(result => {
       if (result) {
           return { success: true, userData: result };
       }
    }).catch(err => {
        return { success: false, error: err }
    });
};
