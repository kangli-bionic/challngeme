const model = require('../models/model');
const multer  = require('multer');
const Cryptr = require('cryptr');

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
    if(file.mimetype.toLowerCase().includes('image/'.toLowerCase())){
        cb(null, true);
    }else{
        cb(new Error('Please upload an image file'));
    }
};

let upload = multer({ storage: storage, limits:{fileSize: 20971520 }, fileFilter: fileFilter });

const claimAccount = (req, res) => {
    let email = req.body.email;
    let password = req.body.pass;

    model.claimAccount(email, password).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });
}

const getCategories = (req, res) => {
    let userId = req.query.userId;
    model.getCategories(userId).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });
}

const saveCategory = (req, res) => {
    let userId = req.body.userId;
    let selected = req.body.selected;
    model.saveCategory(userId, selected).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });
}

const getNextChallenge = (req, res) => {
    let userId = req.query.userId;
    model.getNextChallenge(userId).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });
}

const completeChallenge = (req, res) => {
    upload.single('file')(req, res, function (err) {
        if (err) {
            reject(err, res);
        }else{
            let userId = req.body.userId;
            let currentChallengeId = req.body.currentChallengeId;
            let file = req.file.filename;
            model.completeChallenge(currentChallengeId, userId, file).then((data) => {
                fulfill(data, res);
            }, (err) => {
                reject(err, res);
            });
        }
    });
}

const getUserCompletedChallenges = (req, res) => {
    let userId = req.query.userId;
    let limit = req.query.limit;
    model.getUserCompletedChallenges(userId, limit).then((data) => {
        fulfill(data, res);
    },(err) => {
        reject(err, res);
    })
}

const getUserChallengeByChallengeId = (req, res) => {
    let userId = req.query.userId;
    let challengeId = req.query.challengeId;
    model.getUserChallengeByChallengeId(userId, challengeId).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });

}

const getUserScore = (req, res) => {
    let userId = req.query.userId;
    model.getUserScore(userId).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });

}

const saveProfile = (req, res) => {
    upload.single('photo')(req, res, function (err) {
        if (err) {
            reject(err, res);
        }else{
            let userId = req.body.userId;
            let user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                photo: req.file ? req.file.filename : null
            };
            model.saveProfile(userId,user).then((data) => {
                fulfill(data, res);
            }, (err) => {
                reject(err, res);
            });
        }
    });
}

const getProfile= (req, res) => {
    let userId = req.query.userId;
    model.getProfile(userId).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });

}

const getPublicProfile = (req, res) => {
    let userId = req.query.userId;
    const crypt = new Cryptr('thesecret');
    let challengeId = crypt.decrypt(req.query.challengeId);;

    model.getPublicProfile(userId, challengeId).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });
}

const shareChallenge = (req, res) => {
    let userId = req.body.userId;
    let challengeId = req.body.challengeId;
    model.shareChallenge(userId, challengeId).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });
}

const removePhoto = (req, res) => {
    let userId = req.body.userId;
    model.removePhoto(userId).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });
}

const fulfill = (data, res) => {
    res.json(data);
}

const reject = (err, res) => {
    console.log(err.message);
    res.status(500).send(err.message || 'Sorry, something wrong has happened. Try again later.');
}

module.exports = {
    claimAccount: claimAccount,
    saveCategory: saveCategory,
    completeChallenge: completeChallenge,
    getNextChallenge: getNextChallenge,
    getCategories: getCategories,
    getUserCompletedChallenges: getUserCompletedChallenges,
    getUserChallengeByChallengeId: getUserChallengeByChallengeId,
    getUserScore: getUserScore,
    saveProfile: saveProfile,
    getProfile: getProfile,
    getPublicProfile: getPublicProfile,
    shareChallenge: shareChallenge,
    removePhoto: removePhoto
}
