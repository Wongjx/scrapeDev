// get the client
const mysql = require('mysql2/promise');
const config = require('../config/db');
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
/**
 * Insert single post into FacebookPosts 
 * @param {string} VendorID UUID of vendor
 * @param {number} PostDate Datetime of post in epoch format
 * @param {string} Contents Contents of post
 * @return {Object} Result of transaction 
 */
async function insertPost(VendorID,PostDate,Contents){
    // TODO: insert single post into FacebookPosts
    const db = await getConnectionToDatabase().catch(logError);
    const results = await db.query(queries.INSERT_POST_QUERY, [VendorID,PostDate,Contents]).catch(logError);
    db.end();
    return results;
}
async function insertMultiplePosts(fbPosts){
    if(fbPosts.length<1){
        console.error('insertMultiplePosts: number of posts to insert less than 1');
        return;
    }
    const db = await getConnectionToDatabase().catch(logError);
    const results0 =  await db.beginTransaction().catch(logError);
    console.log(results0);
    fbPosts.forEach(async post => {
        if(post.length<3){
            console.error(`insertMultiplePosts: post missing some data. ${post}`);
        } else {
            const results1 = await db.query(queries.INSERT_POST_QUERY, post).catch(logError);
            console.log(results1);
        }
    });
    const result4 = await db.commit().catch(logError);
    // console.log(result4);
    db.end();
    return result4;
}
async function insertMultiplePrices(vendorId,postDate,durianPrices){
    const db = await getConnectionToDatabase().catch(logError);
    const results0 =  await db.beginTransaction().catch(logError);
    //prep multiple insert queries
    const insertPricePromiseArray = [];
    durianPrices.forEach(price => {
        if(/\s/.test(price[0])){ //multiple durian price
            price[0].split(" ").forEach(element => {
                insertPricePromiseArray.push(db.query(queries.INSERT_DURIANPRICE_QUERY, [vendorId,postDate,element,price[1]]));        
            });
        } else {
            insertPricePromiseArray.push(db.query(queries.INSERT_DURIANPRICE_QUERY, [vendorId,postDate,price[0],price[1]]));
        }
    });
    try {
        const insertResponses = await Promise.all(insertPricePromiseArray);
        const updateResponse = await db.query(queries.UPDATE_FACEBOOKPOST_QUERY, [true, vendorId, postDate]);
        const commitResponse = await db.commit();
    } catch (error){
        console.error(`Error inserting prices for post VendorId: ${vendorId}, PostDate: ${postDate}`);
        console.error(error);
        db.rollback(logError);
        return false;
    }
    db.end();
    return true;
}
async function updateMultipleFacebookPostsIsProcessed(facebookPosts){
    const db = await getConnectionToDatabase().catch(logError);
    const results0 =  await db.beginTransaction().catch(logError);
    const insertPricePromiseArray = [];
    facebookPosts.forEach(post => {
        insertPricePromiseArray.push(db.query(queries.UPDATE_FACEBOOKPOST_QUERY, [true,post.VendorID,post.PostDate]));
    });
    const results1 = await Promise.all(insertPricePromiseArray).catch((err) => {
        console.error(err);
        db.rollback(logError);
        return false;
    });
    await db.commit().catch(logError);
    db.end();
    return true;
}
async function selectSinglePost(facebookPageName, eopchSecInt){
    // TODO: Select row from FacebookPosts by vendor name and time
}

async function selectAllVendorPosts(facebookPageName){
    const db = await getConnectionToDatabase().catch(logError);
    // get vendor uuid
    const [vendorIdRows, vendorFields] = await db.query(queries.SELECT_VENDORID_BY_FBPAGENAME_QUERY, [facebookPageName]).catch(logError);
    if(vendorIdRows.length!=1){
        console.error('Number of Ids returned not eqauls to than 1');
    }
    // Get vendors facebook posts
    const [vendorFacebookPosts, fbPostsFields] = await db.query(queries.SELECT_ALL_QUERY+queries.WHERE_VENDORID_CONDITION, ['FacebookPosts',vendorIdRows[0].VendorID]).catch(logError);
    db.end();
    return vendorFacebookPosts;
}
async function selectAllVendors(){
    const db = await getConnectionToDatabase().catch(logError);
    const [rows, fields] = await db.query(queries.SELECT_ALL_QUERY, ['Vendors']).catch(logError);
    db.end();
    return rows;
}
async function selectUnprocessedFacebookPosts(){
    const db = await getConnectionToDatabase().catch(logError);
    const [unprocessedFbPosts, fields1] = await db.query(queries.SELECT_UNPROCESSED_FBPOSTS_QUERY).catch(logError);
    db.end();
    return unprocessedFbPosts;
}
async function selectLatestDurianPrices(){
    const db = await getConnectionToDatabase().catch(logError);
    const [latestDurianPrices, fields1] = await db.query(queries.SELECT_LATEST_PRICES_QUERY).catch(logError);
    db.end();
    return latestDurianPrices;
}
module.exports.selectAllVendors = selectAllVendors;
module.exports.selectAllVendorPosts = selectAllVendorPosts;
module.exports.selectUnprocessedFacebookPosts = selectUnprocessedFacebookPosts;
module.exports.insertPost = insertPost;
module.exports.insertMultiplePosts = insertMultiplePosts;
module.exports.insertMultiplePrices = insertMultiplePrices;

// selectLatestDurianPrices().then((res) => {
//     console.log(res);
// });