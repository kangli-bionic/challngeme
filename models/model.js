const Promise = require('promise');
const password = require('password-hash-and-salt');
const db = require('../config/db');
const entities = require('./entities');

let entity = entities(db);

const getUser = Promise.denodeify(entity.User.get);

const completeChallenge = (userId, file) => {
    return new Promise((fulfill, reject) => {
        getUserCurrentChallenge(userId).then((currentChallenge, user) => {
            const currentChallengeId = currentChallenge[0].id;
            markChallengeAsCompleted(currentChallengeId, userId, file).then(() => {
                getPossibleChallenges(userId).then((challenges) => {
                    const challengeId = challenges[Math.floor(Math.random() * (data.length - 1))].id;
                    assignChallenge(challengeId, user).then((challenge) => {
                        fulfill(challenge);
                    }, reject);
                }, reject);
            }, reject);
        });
    });

}

const claimAccount = (email, pass) => {
    const findUser = Promise.denodeify(entity.User.find);
    return new Promise((fulfill, reject) => {
        findUser({email: email}).then((users) => {
            password(pass).hash((error, hash) => {
                if(error) reject(error);
                let hashedPassword = hash;
                let user = users[0];
                if(user){
                    password(pass).verifyAgainst(user.password, (err, verified) => {
                        if (!verified || err){
                            let message = !data.verified ? 'Wrong email/password' : err.message;
                            reject(new Error(message));
                        }
                        login(fulfill, reject, user.id);
                    });
                }else{
                    signup(fulfill, reject, {email: email, password: hashedPassword});
                }
            });
        }, reject);
    });

};

const saveCategory = (userId, categories) => {
    return new Promise((fulfill, reject) => {
        getUser(userId).then((user) => {
            user.categories = categories;
            user.save();
            fulfill({
                newUser: false,
                redirect: 'dash/challenge'
            });
        }, reject);
    });
}

const getNextChallenge = (userId) => {
    return new Promise((fulfill, reject) => {
        getPossibleChallenges(userId).then((challenges) => {
            try{
                getUserCurrentChallenge(userId).then((currentChallenge, user) => {
                    if(currentChallenge.length > 0){
                        fulfill(currentChallenge[0]);
                    }else{
                        let challengeId = challenges[Math.floor(Math.random() * (data.length - 1))].id;
                        assignChallenge(challengeId, user).then((challenge) => {
                            fulfill(challenge);
                        }, reject);
                    }
                }, reject);
            }catch(ex){
                reject(ex);
            }
        });
    });
}

const assignChallenge = (challengeId, user) => {
    return new Promise((fulfill, reject) => {
        const getChallenge = Promise.denodeify(entity.Challenge.get);
        getChallenge(challengeId).then((challenge) => {
            user.addChallenges([challenge], {current: 1}, (err) => {
                if(err) reject(err);
                fulfill(challenge);
            });
        }, reject);
    });
}

const markChallengeAsCompleted = (challengeId, userId, file) => {
    return new Promise((fulfill, reject) => {
        entity.UserChallenges.find({challenges_id: challengeId, user_id: userId}, (err, current) => {
            if(err) reject(err);
            try{
                let currentChallenge = current[0];

                currentChallenge.current = 0;
                currentChallenge.completed = 1;
                currentChallenge.image = file;
                currentChallenge.save();
            }catch(ex){
                reject(ex);
            }
        });
    });
}

const login = (fulfill, reject, userId) => {
    getUser(userId).then((user) => {
        fulfill({
            user: {
                id: user.id,
                name: user.fullName(),
                photo: user.photo,
                newUser: false
            },
            redirect: '/dash/challenge'
        });
    }, reject);
}

const signup = (fulfill, reject, user) => {
    const createUser = Promise.denodeify(entity.User.create);
    createUser({ email: user.email, password: user.password}).then(() => {
        fulfill({
            user: {
                id: user.id,
                name: user.fullName(),
                photo: user.photo,
                newUser: true
            },
            redirect: '/dash/category'
        });
    }, reject);
}

const getUserCurrentChallenge = (userId) => {
    return new Promise((fulfill, reject) => {
        getUser(userId).then((user) => {
            user.getChallenges((err, challenges) => {
                if(err) reject(err);

                let currentChallenge = challenges.filter((challenge) => {
                    return challenge.current == 1;
                });
                fulfill(currentChallenge, user);
            });
        }, reject);
    });
}

const getCategories = (userId) => {
    let query = `select 
            c.id, c.name, c.description, 
            IFNULL(uc.id, 0) selected 
        from category c
        left join user_categories uc on c.id = uc.categories_id 
            and uc.user_id = ?`;
    return new Promise((fulfill, reject) => {
        db.driver.execQuery(query, [userId], (err, data) => {
            if(err) reject(err);
            fulfill(data);
        });
    });
}

const getPossibleChallenges = (userId) => {
    const query = `select 
        c.id
    from user_categories uc
    inner join challenge c on c.category_id = uc.categories_id
    where c.id not in
        ( select uch.id from user_challenges uch
        where uch.challenges_id = c.id
        AND uch.user_id = ?) and uc.user_id = ?`;
    return new Promise((fulfill, reject) => {
        db.driver.execQuery(query, [userId, userId], (err, data) => {
            if(err) reject(err);
            fulfill(data);
        });
    });
}

module.exports = {
    claimAccount: claimAccount,
    saveCategory: saveCategory,
    completeChallenge: completeChallenge,
    getNextChallenge: getNextChallenge,
    getCategories: getCategories
};

