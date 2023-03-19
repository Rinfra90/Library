const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'library'
})

function execQuery(sql, callback) {
    // connection.connect();
    connection.query(sql, callback);
    // connection.end();
}

module.exports = execQuery;