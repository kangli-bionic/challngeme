'use strict';

var orm = require("orm");
var promise = require('promise');
var password = require('password-hash-and-salt');

var db = orm.connect(process.env.DBCONNECTION || "mysql://root@localhost/challngeme");


db.on('connect', (err) => {
    if (err) {
        return console.error('Connection error: ' + err);
    }

    console.log('Connected to database');
});



const getNextChallenge = (userId, callback) => {
    let query = `select 
        c.id
    from user_categories uc
    inner join challenge c on c.category_id = uc.categories_id
    where c.id not in
        ( select uch.id from user_challenges uch
        where uch.challenges_id = c.id
        AND uch.user_id = ?) and uc.user_id = ?`;

    db.driver.execQuery(
        query,
        [userId, userId],
        (err, data) => {
            callback(err, data);
        }
    );
}

const getUserCurrentChallenge = (user, callback) => {
    user.getChallenges((err, challenges) => {
        let currentChallenge = challenges.filter((challenge) => {
           return challenge.current == 1;
       });
        callback(currentChallenge);
    });
}

const getUserCategories = (userId, callback) => {
    let query = `select 
            c.id, c.name, c.description, 
            IFNULL(uc.id, 0) selected 
        from category c
        left join user_categories uc on c.id = uc.categories_id 
            and uc.user_id = ?`;

    db.driver.execQuery(
        query,
        [userId],
        (err, data) => {
            callback(err, data);
        }
    );
}

const completeChallenge = (challengeId, userId, file) => {
    models.UserChallenges.find({challenges_id: challengeId, user_id: userId}, (err, current) => {
        let currentChallenge = current[0];

        currentChallenge.current = 0;
        currentChallenge.completed = 1;
        currentChallenge.image = file;
        currentChallenge.save();
    });
}

const claimAccount = (email, pass, callback) => {
    models.User.find({email: email}, (err, users) => {
        password(pass).hash((error, hash) => {
            let hashedPassword = hash;
            let user = users[0];
            if(user){
                password(pass).verifyAgainst(user.password, (err, verified) => {
                    callback(err, {verified, id: user.id}, null);
                });
            }else{
                callback(err, null, hashedPassword);
            }
        });
    });
}

var models = {
    User: db.define('user',{
        id: {type: 'serial', key: true},
        email: {type: 'text', unique: true},
        password: {type: 'text'},
        name: {type: 'text'},
        lastName: {type: 'text', mapsTo: 'last_name'},
        birthday: {type: 'date'},
        photo: {type: 'text'}
    },{
        methods : {
            fullName: () => (this.name + ' ' + this.lastName) || this.email
        },
        validations: {
            email: orm.enforce.unique("Already exists an account with this email.")
        }
    }),
    Category: db.define('category',{
        id: {type: 'serial', key: true},
        name: {type: 'text'},
        description: {type: 'text'}
    }),
    Challenge: db.define('challenge', {
        id: {type: 'serial', key: true},
        description: {type: 'text'},
        points: {type: 'number'},
        bonus: {type: 'number'},
    }),
    UserChallenges: db.define('user_challenges', {
        id: {type: 'serial', key: true},
        completed: {type: 'number'},
        current: {type: 'number'},
        challenges_id: {type: 'number'},
        user_id: {type: 'number'},
        image: {type: 'text'}
    }),
    getNextChallenge: getNextChallenge,
    getUserCategories: getUserCategories,
    claimAccount: claimAccount,
    getUserCurrentChallenge: getUserCurrentChallenge,
    completeChallenge: completeChallenge
}

models.User.hasMany('categories', models.Category, {}, { key: true });
models.User.hasMany('challenges', models.Challenge, {completed: Number, image: String, current: Number}, { key: true} );
models.Challenge.hasOne('category', models.Category, {}, { reverse: 'challenges', autoFetch: true});

module.exports = models;

