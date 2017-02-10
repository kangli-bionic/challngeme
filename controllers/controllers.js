const model = require('../models/model');

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
    model.saveCategory(userId).then((data) => {
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
    let userId = req.body.userId;
    let currentChallengeId = req.body.currentChallengeId;
    let file = req.file.filename;
    model.completeChallenge(currentChallengeId, userId, file).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });
}

const getUserCompletedChallenges = (req, res) => {
    let userId = req.query.userId;
    model.getUserCompletedChallenges(userId).then((data) => {
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


const fulfill = (data, res) => {
    console.log('fulfill');
    res.json(data);
}

const reject = (err, res) => {
    console.log('reject');
    res.status(500).send(err.message);
}

module.exports = {
    claimAccount: claimAccount,
    saveCategory: saveCategory,
    completeChallenge: completeChallenge,
    getNextChallenge: getNextChallenge,
    getCategories: getCategories,
    getUserCompletedChallenges: getUserCompletedChallenges,
    getUserChallengeByChallengeId: getUserChallengeByChallengeId
}
