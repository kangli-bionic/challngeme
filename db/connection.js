'use strict';

var orm = require("orm");
var promise = require('promise');

var db = orm.connect("mysql://root@localhost/challngeme");


db.on('connect', (err) => {
    if (err) {
        return console.error('Connection error: ' + err);
    }

    console.log('Connected to database');
});



let getChallenge = (userId) => {
    return new Promise( (fulfill, reject) => {
        db.driver.execQuery(
            `select 
            c.id,
            c.description,
            c.points,
            c.bonus,
            cat.name categoryName
        from user_categories uc
        inner join challenge c on c.category_id = uc.categories_id
        inner join category cat on cat.id = c.category_id
        where c.id not in
            ( select uch.id from user_challenges uch
            where uch.challenges_id = c.id
            AND uch.users_id = ?) and uc.user_id = ?`,
            [userId, userId],
            (err, data) => {
                if(err) {
                    reject(err);
                }else{
                    fulfill(data);
                }
            }
        );
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
            fullName: () => this.name + ' ' + this.lastName
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
        categoryId: {type: 'number', mapsTo: 'category_id'}
    }),
    getNextChallenge: getChallenge
}

models.User.hasMany('categories', models.Category, {}, { reverse: 'users', key: true });
models.User.hasMany('challenges', models.Challenge, {completed: Number, image: String}, { reverse: 'users', key: true, autoFetch: true } );
models.Challenge.hasOne('category', models.Category, {}, { reverse: 'challenges', autoFetch: true});

module.exports = models;

