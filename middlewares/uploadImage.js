import multer from 'multer';


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let uploadPath;
        const { type } = req.query;
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        if (type == 'user') {
            uploadPath = 'images/userAvatar';
        } else {
            uploadPath = 'images/workspacesLogos'
        }

        cb(error, uploadPath);
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase();
        cb(null, Date.now() + '-' + name);
    }
});

module.exports = multer({storage: storage});
