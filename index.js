const repository = require('./repository');
const scrape = require('./scrape');
const utils = require('./utils');
const fs = require('fs');

async function main() {
    const vendors = await repository.selectAllVendors();
    //get all unprocessed fbposts
    
    //for each fb post, parse prices, insert all prices into db as 1 transaction
    
};

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

// main();
scrapeRoutine();