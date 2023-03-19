const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'library'
})

function execQuery(sql, callback) {
    connection.query(sql, callback);
}

module.exports = execQuery;