import bcrypt from 'bcrypt';

exports.hasingPassword = (password) => {
  return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) =>{
         if (err) {
             return reject(err);
         }
         return resolve(hash);
      });
  })
};
