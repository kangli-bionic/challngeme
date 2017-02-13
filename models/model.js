const Promise = require('promise');
const password = require('password-hash-and-salt');
const db = require('../config/db');
const entities = require('./entities');

let entity = entities(db);

const getUser = Promise.denodeify(entity.User.get);

//User
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

const login = (fulfill, reject, userId) => {
    getUser(userId).then((user) => {
        fulfill({
            user: {
                id: user.id,
                name: user.email,
                photo: user.photo,
                newUser: false
            },
            redirect: '/dash'
        });
    }, reject);
}

const signup = (fulfill, reject, user) => {
    const createUser = Promise.denodeify(entity.User.create);
    createUser({ email: user.email, password: user.password}).then((userDb) => {
        fulfill({
            user: {
                id: userDb.id,
                name: userDb.fullName(),
                photo: userDb.photo,
                newUser: true
            },
            redirect: '/dash/category'
        });
    }, reject);
}

//Category
const saveCategory = (userId, categories) => {
    return new Promise((fulfill, reject) => {
        getUser(userId).then((user) => {
            user.categories = categories;
            user.save();
            fulfill({
                newUser: false,
                redirect: '/dash/'
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
                    if(currentChallenge.length > 0){
                        fulfill(currentChallenge[0]);
                    }else{
                        let challengeId = challenges[Math.floor(Math.random() * (challenges.length - 1))].id;
                        assignChallenge(challengeId, userId).then(fulfill, reject);
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
        entity.UserChallenges.create({challenges_id: challengeId, userId: userId, current: 1}, (err, result) => {
           console.log(err);
            if(err) reject(err);
            getChallengesByUser(result.userId).then((challenges) => {
               let challenge = challenges.filter((challenge) =>{
                   return challenge.id == result.challenges_id;
               });
                fulfill(challenge[0]);
            }, reject);
        });
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
                currentChallenge.save((err, result) => {
                    if(err) reject(err);
                    fulfill(result.challenges_id);
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
            if(data.length <= 0) { reject(new Error ('Congrats! You completed all challenges for now!'));}
            fulfill(data);
        });
    });
}

const getChallengesByUser = (userId) => {
    return new Promise((fulfill, reject) => {
        getUser(userId).then((user) => {
            user.getChallenges((err, challenges) => {
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

const getUserCompletedChallenges = (userId) => {
    return new Promise((fulfill, reject) => {
       getChallengesByUser(userId).then((challenges) => {
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
    getUserScore: getUserScore
};

