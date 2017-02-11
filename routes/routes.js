const multer  = require('multer');
const controllers = require('../controllers/controllers');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        let originalname = file.originalname;
        let extension = originalname.substring(originalname.lastIndexOf('.'), originalname.length);
        cb(null, originalname + '-' + Date.now() + extension);
    }
});

const fileFilter =(req, file, cb) => {
    let originalname = file.originalname;
    let extension = originalname.substring(originalname.lastIndexOf('.'), originalname.length);
    if(extension == ".jpg" || extension == ".jpeg" || extension == ".png"){
        cb(null, true);
    }else{
        cb(new Error('Please upload a jpg, jpeg or png image file'));
    }
};

let upload = multer({ storage: storage, limits:{fileSize: 700000 }, fileFilter: fileFilter });

const routes = (app) => {
    app.post('/claimAccount', controllers.claimAccount);
    app.get('/dash/getCategories', controllers.getCategories);
    app.get('/dash/getNextChallenge', controllers.getNextChallenge);
    app.post('/dash/completeChallenge', upload.single('file') ,controllers.completeChallenge);
    app.post('/dash/saveCategory', controllers.saveCategory);
    app.get('/dash/getChallenges', controllers.getUserCompletedChallenges);
    app.get('/dash/getUserChallengeByChallengeId', controllers.getUserChallengeByChallengeId);
    app.get('/dash/getUserScore', controllers.getUserScore);
}

module.exports = routes;