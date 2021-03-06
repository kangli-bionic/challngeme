const orm = require("orm");

let db = orm.connect(process.env.DB_URL || "mysql://root@localhost/challngeme");

db.on('connect', (err) => {
    if (err) {
        return console.error('Connection error: ' + err);
    }
    console.log('Connected to database');
});

module.exports = db;