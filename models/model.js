const Promise = require('promise');
const password = require('password-hash-and-salt');
const db = require('../config/db');
const entities = require('./entities');
const fs = require('fs');
let entity = entities(db);

const getUser = Promise.denodeify(entity.User.get);
const emailRegEx = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/);
//User
const claimAccount = (email, pass) => {
    const findUser = Promise.denodeify(entity.User.find);
    return new Promise((fulfill, reject) => {
        if(!emailRegEx.test(email)){
            reject(new Error('Type a valid email address please'));
        }
        if(!pass){
            reject(new Error('Type your password please'));
        }
        findUser({email: email}).then((users) => {
            password(pass).hash((error, hash) => {
                if(error) reject(error);
                let hashedPassword = hash;
                let user = users[0];
                if(user){
                    password(pass).verifyAgainst(user.password, (err, verified) => {
                        if (!verified || err){
                            let message = !verified ? 'Wrong email/password' : err.message;
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

const login = (fulfill, reject, userId) => {
    getUser(userId).then((user) => {
        fulfill({
            user: {
                id: user.id,
                name: user.name && user.lastName ? `${user.name} ${user.lastName}` : user.email,
                photo: user.photo,
                newUser: false
            },
            redirect: '/current'
        });
    }, reject);
}

const signup = (fulfill, reject, user) => {
    const createUser = Promise.denodeify(entity.User.create);
    createUser({ email: user.email, password: user.password}).then((userDb) => {
        fulfill({
            user: {
                id: userDb.id,
                name: user.name && user.lastName ? `${user.name} ${user.lastName}` : user.email,
                photo: userDb.photo,
                newUser: true
            },
            redirect: '/categories'
        });
    }, reject);
}

const saveProfile = (userId, data) => {
    return new Promise((fulfill, reject) => {
       getUser(userId).then((user) => {
           user.name = data.firstName;
           user.lastName = data.lastName;
           if(user.photo){
               fs.unlink(`/uploads/${user.photo}`);
           }
           if(data.photo){
               user.photo = data.photo;
           }
           user.save((err, result) => {
               if(err) reject(err);
               fulfill({
                   name:result.name,
                   lastName: result.lastName,
                   photo: result.photo,
                   email: user.email
               });
           });
       }, reject);
    });
}

const getProfile = (userId) => {
    return new Promise((fulfill, reject) => {
        getUser(userId).then((user) => {
            fulfill({
                name:user.name,
                lastName: user.lastName,
                photo: user.photo,
                email: user.email
            });
        }, reject);
    });
}

//Category
const saveCategory = (userId, categories) => {
    return new Promise((fulfill, reject) => {
        getUser(userId).then((user) => {
            user.categories = categories;
            user.save();
            fulfill({
                newUser: false,
                redirect: '/current'
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
            and uc.user_id = ?;`;
    return new Promise((fulfill, reject) => {
        db.driver.execQuery(query, [userId], (err, data) => {
            if(err) reject(err);
            fulfill(data);
        });
    });
}

//Challenge
const getNextChallenge = (userId) => {
    return new Promise((fulfill, reject) => {
        getPossibleChallenges(userId).then((challenges) => {
            try{
                getUserCurrentChallenge(userId).then((currentChallenge) => {
                    let challenge = challenges[Math.floor(Math.random() * (challenges.length - 1))];
                    if(currentChallenge.length > 0){
                        fulfill(currentChallenge[0]);
                    }else if(challenges.length <= 0){
                        fulfill(null);
                    }else if (challenge){
                        assignChallenge(challenge.id, userId).then(fulfill, reject);
                    }
                }, reject);
            }catch(ex){
                reject(ex);
            }
        });
    });
}

const completeChallenge = (currentChallengeId, userId, file) => {
    return new Promise((fulfill, reject) => {
        markChallengeAsCompleted(currentChallengeId, userId, file).then((completedChallengeId) => {
            getChallengesByUser(userId).then((challenges) => {
                let completedChallenge = challenges.filter((challenge) => {
                  return challenge.id == completedChallengeId;
                });
                fulfill(completedChallenge[0]);
            }, reject);
        }, reject);
    });

}


const assignChallenge = (challengeId, userId) => {
    return new Promise((fulfill, reject) => {
        entity.UserChallenges.create({ challengeId, userId, current: 1}, (err, result) => {
            if(err) reject(err);
            getChallengesByUser(result.userId).then((challenges) => {
               let challenge = challenges.filter((challenge) =>{
                   return challenge.id == result.challengeId;
               });
                fulfill(challenge[0]);
            }, reject);
        });
    });
}

const markChallengeAsCompleted = (challengeId, userId, file) => {
    return new Promise((fulfill, reject) => {
        entity.UserChallenges.find({challengeId, userId}, (err, current) => {
            if(err) reject(err);
            try{
                let currentChallenge = current[0];
                currentChallenge.current = 0;
                currentChallenge.completed = 1;
                currentChallenge.image = file;
                currentChallenge.save((err, result) => {
                    if(err) reject(err);
                    fulfill(result.challengeId);
                });
            }catch(ex){
                reject(ex);
            }
        });
    });
}


const getUserCurrentChallenge = (userId) => {
    return new Promise((fulfill, reject) => {
        getChallengesByUser(userId).then((challenges) => {
            let currentChallenge = challenges.filter((challenge) => {
                return challenge.current == 1;
            });
            fulfill(currentChallenge);
        }, reject);
    });
}

const getPossibleChallenges = (userId) => {
    const query = `select 
        c.id
    from user_categories uc
    inner join challenge c on c.category_id = uc.categories_id
    where c.id not in
        ( select uch.challenges_id from user_challenges uch
        where uch.challenges_id = c.id
        AND uch.user_id = ?) and uc.user_id = ?;`;
    return new Promise((fulfill, reject) => {
        db.driver.execQuery(query, [userId, userId], (err, data) => {
            if(err) reject(err);
            fulfill(data);
        });
    });
}

const getChallengesByUser = (userId, limit) => {
    return new Promise((fulfill, reject) => {
        getUser(userId).then((user) => {
            user.getChallenges().limit(limit).run((err, challenges) => {
                if(err) reject(err);
                fulfill(challenges);
            });
        }, reject);
    });
}

const getUserChallengeByChallengeId = (userId, challengeId) => {
    return new Promise((fulfill, reject) => {
        getChallengesByUser(userId).then((challenges) => {
            let challenge = challenges.filter((challenge) => {
                return challenge.id == challengeId;
            });

            fulfill(challenge[0]);
        }, reject);
    });
}

const getUserCompletedChallenges = (userId, limit) => {
    return new Promise((fulfill, reject) => {
       getChallengesByUser(userId, limit).then((challenges) => {
           let completedChallenges = challenges.filter((challenge) => {
               return challenge.completed == 1;
           });
           fulfill(completedChallenges);
       }, reject);
    });
}

const getUserScore = (userId) => {
    let query = `select sum(scores.scores) score
            from
            (select 
                case when c.bonus = 1
                then sum(c.points*2)
                else sum(c.points) end
                scores,
                uc.user_id user_id
            from user_challenges uc 
            inner join challenge c on c.id = uc.challenges_id
            where uc.completed = 1
            group by c.bonus, uc.user_id
            ) scores WHERE scores.user_id = ?`;
    return new Promise((fulfill, reject) => {
        db.driver.execQuery(query, [userId], (err, data) => {
            if(err) reject(err);
            fulfill(data[0]);
        });
    });
}

const getPublicProfile = (userId, challengeId) => {
    return new Promise((fulfill, reject) => {
        getChallengesByUser(userId).then((challenges) => {
            let challenge = challenges.filter((challenge) => {
                return challenge.id == challengeId && challenge.shared == 1;
            });
            fulfill(challenge[0]);
        }, reject);
    });
}

const removePhoto = (userId) => {
    return new Promise((fulfill, reject) => {
        getUser(userId).then((user) => {
            user.photo = null;
            user.save((err, result) => {
                if(user.photo){
                    fs.unlink(`/uploads/${user.photo}`);
                }
                fulfill({
                    photo: result.photo
                });
            });
        }, reject);
    });
}

const shareChallenge = (userId, challengeId) => {
    return new Promise((fulfill, reject) => {
        entity.UserChallenges.find({challengeId, userId}, (err, challengeResult) => {
            if(err) reject(err);
            try{
                let challenge = challengeResult[0];
                challenge.shared = 1;
                challenge.save((err, result) => {
                    if(err) reject(err);
                    fulfill(result.shared);
                });
            }catch(ex){
                reject(ex);
            }
        });
    });
}

const challengeUser = (userId, challengedUser, challengeId) => {
 return new Promise((fulfill, reject) => {
    entity.User.find({email: challengedUser}, (err, user) => {
        let id = user[0];
        if(id){
            //TODO: if user_challenge already has a challenge_user_id cant assigned to the challengedUser
            //TODO: send email to challengeUser with challenge information
            //TODO: update challengedUserId in user_challenges row
            //TODO: check if the user has not been completed by challengedUser
            //TODO: create user_challenge row for challengedUser, mark as current
        }
    });
 });

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
};

