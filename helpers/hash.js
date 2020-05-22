import bcrypt from 'bcrypt';

exports.hashingPassword = (password) => {
  return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) =>{
         if (err) {
             return reject(err);
         }
         return resolve(hash);
      });
  });
};

exports.comparePassword = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
