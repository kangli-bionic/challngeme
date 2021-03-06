const orm = require("orm");

module.exports = (db) => {
    let User = db.define('user',{
        id: {type: 'serial', key: true},
        email: {type: 'text', unique: true},
        password: {type: 'text'},
        name: {type: 'text'},
        lastName: {type: 'text', mapsTo: 'last_name'},
        birthday: {type: 'date'},
        photo: {type: 'text'}
    },{
        validations: {
            email: orm.enforce.unique("Already exists an account with this email.")
        }
    });

    let Category = db.define('category',{
        id: {type: 'serial', key: true},
        name: {type: 'text'},
        description: {type: 'text'}
    });

    let Challenge = db.define('challenge', {
        id: {type: 'serial', key: true},
        description: {type: 'text'},
        points: {type: 'number'},
        bonus: {type: 'number'},
    });

    let UserChallenges = db.define('user_challenges', {
        id: {type: 'serial', key: true},
        completed: {type: 'number'},
        current: {type: 'number'},
        challengeId: {type: 'number', mapsTo:'challenges_id'},
        userId: {type: 'number', mapsTo: 'user_id'},
        image: {type: 'text'},
        shared: {type: 'number'},
        challengedUserId: {type: 'number', mapsTo: 'challenged_user_id'},
        declined: {type: 'number'}
    });

    User.hasMany('categories', Category, {}, { key: true });
    User.hasMany('challenges', Challenge, {completed: Number, image: String, current: Number, shared:Number}, { key: true, autoFetch:true} );
    Challenge.hasOne('category', Category, {}, { autoFetch: true});

    return {
        User: User,
        Category: Category,
        Challenge: Challenge,
        UserChallenges: UserChallenges
    }
};
