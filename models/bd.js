var mysql = require('mysql');
var util = require('util');

var pool = mysql.createPool({
    connectionLimit: 10,
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host:         process.env.MYSQL_HOST,
    user:        process.env.MYSQL_USER,
    password:    process.env.MYSQL_PASSWORD,
    database:    process.env.MYSQL_DB_NAME
})

pool.query = util.promisify(pool.query);
module.exports = pool;

