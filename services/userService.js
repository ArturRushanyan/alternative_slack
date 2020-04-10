import userModel from '../models/User';

exports.findUserByEmail = (userEmail) => {
    return userModel.findOne({ email: userEmail });
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
    return userModel.findOneAndUpdate(query, attributes, { upsert: true, new: true });

};
