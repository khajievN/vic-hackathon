'user strict';
let config = require('../env/config')
const { attachPaginate } = require('knex-paginate');
const knexDb = require('knex')({
    client: 'mysql2',
    connection: {
        host: config.DB_HOST,
        port: 3306,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_SCHEMA,
    }
    , pool: {min: 0, max: 10}
});


attachPaginate();

module.exports = {
    knexDb
}
