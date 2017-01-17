'use strict';

var orm = require("orm");

var db = orm.connect("mysql://root@localhost/challngeme");


db.on('connect',
    (err) => {
        if (err) {
            return console.error('Connection error: ' + err);
        }

        console.log('Connected to database');
});

var models = {
    User: db.define('users',{
        id: {type: 'serial', key: true},
        email: {type: 'text', unique: true},
        password: {type: 'text'},
        name: {type: 'text'},
        lastName: {type: 'text', mapsTo: 'last_name'},
        birthday: {type: 'date'}
    },{
        methods : {
            fullName: () => this.name + ' ' + this.lastName
        },
        validations: {
            email: orm.enforce.unique("Already exists an acoount with this email.")
        }
    })
}

module.exports = models;

