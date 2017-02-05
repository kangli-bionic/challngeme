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
    model.getNextChallenge().then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });
}

const completeChallenge = (req, res) => {
    let userId = req.body.userId;
    let file = req.file.filename;
    model.completeChallenge(userId, file).then((data) => {
        fulfill(data, res);
    }, (err) => {
        reject(err, res);
    });
}

const fulfill = (data, res) => {
    res.json(data);
}

const reject = (err, res) => {
    res.status(500).send(err.message);
}

module.exports = {
    claimAccount: claimAccount,
    saveCategory: saveCategory,
    completeChallenge: completeChallenge,
    getNextChallenge: getNextChallenge,
    getCategories: getCategories
}
