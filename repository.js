// get the client
const mysql = require('mysql2/promise');
const config = require('./config/db');
const queries = require('./queries');

function logError(err) {
    console.error(err);
}

function getConnectionToDatabase(){
    return mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database
    });
}

async function insertPost(){
    // TODO: insert single post into FacebookPosts
}
async function insertMultiplePosts(){
    // TODO: Insert multiple rows into FacebookPosts in single transaction
}
async function selectSinglePost(facebookPageName, eopchSecInt){
    // TODO: Select row from FacebookPosts by vendor name and time
}

async function selectAllVendorPosts(facebookPageName){
    // TODO: Select all rows by vendor name
}

async function selectAllVendors(){
    const db = await getConnectionToDatabase().catch(logError);
    const [rows, fields] = await db.query(queries.SELECT_ALL_QUERY, ['Vendors']).catch(logError);
    db.end();
    return rows;
}

module.exports.selectAllVendors = selectAllVendors;