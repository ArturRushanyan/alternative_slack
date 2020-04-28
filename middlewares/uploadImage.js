import multer from 'multer';


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'images/userAvatar');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase();
        cb(null, Date.now() + '-' + name);
    }
});

module.exports = multer({storage: storage});
