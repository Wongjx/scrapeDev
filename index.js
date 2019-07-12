const repository = require('./repository');
const scrape = require('./scrape');
const parser = require('./parser');
const utils = require('./utils');
const fs = require('fs');

async function main() {
    // //get all unprocessed fbposts
    const vendors = await repository.selectAllVendors();
    const vendorMap = getVendorIdToFbPageNameMap(vendors);
    const unprocessedFbPosts = await repository.selectUnprocessedFacebookPosts();
    
    //for each fb post, parse prices, insert all prices into db as 1 transaction
    const results = unprocessedFbPosts.map(async (post) =>{
        const parsedPrices = parser.parseDurianPrice(vendorMap.get(post.VendorID),post.Contents);
        return await repository.insertMultiplePrices(post.VendorID,post.PostDate,parsedPrices.filter((price)=> price!==undefined ));
    });
    console.log(results);
};

function getVendorIdToFbPageNameMap(vendors){
    const vendorMap = new Map();
    vendors.forEach(vendor => {
        vendorMap.set(vendor.VendorID,vendor.FacebookPageName);
    });
    return vendorMap;
}

async function scrapeRoutine(){
    const vendors = await repository.selectAllVendors();
    console.log('Start login into facebook');

    const loginResponse  = await scrape.loginIntoFb();
    console.log(`LoginResponse: ${loginResponse}`);
    //Scrape vendor pages for post urls
    await Promise.all(vendors.map(async (vendor) => {
        setTimeout(async () => {
            const postInfoArray = await scrape.scrapeFbPage(vendor.FacebookPageName);
            const result = await repository.insertMultiplePosts(postInfoArray.map((element) => {
                element.unshift(vendor.VendorID);
                return element;
            })); 
            return result;
        }, Math.floor(Math.random() * Math.floor(10000))); //Scrape each page at random timings within 10 seconds
    }))
}

main();

// scrapeRoutine();