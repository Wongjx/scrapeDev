const repository = require('./services/repository');
const scrape = require('./services/scrape');
const parser = require('./services/parser');
const utils = require('./services/utils');

async function processFacebookPosts() {
    // //get all unprocessed fbposts
    const vendors = await repository.selectAllVendors();
    const vendorMap = getVendorIdToFbPageNameMap(vendors);
    const unprocessedFbPosts = await repository.selectUnprocessedFacebookPosts();
    //for each fb post, parse prices, insert all prices into db as 1 transaction
    unprocessedFbPosts.forEach(async (post) =>{
        const vendorPageName = vendorMap.get(post.VendorID);
        if(parser.hasPriceRegex(vendorPageName)){
            const parsedPrices = parser.parseDurianPrice(vendorPageName,post.Contents);
            const filteredPrices = parsedPrices.filter((price) => {return price[1]});
            if(filteredPrices.length>0){
                return await repository.insertMultiplePrices(post.VendorID,post.PostDate,filteredPrices);
            }
        } else {
            console.log(`Price Regex for ${vendorPageName} is not available`);
        }
    });
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


if (process.argv[2]) {
    switch (process.argv[2]) {
        case 'scrape':
            scrapeRoutine();
            break;
        case 'process':
            processFacebookPosts()
            break;
        default:
            console.error(`Provided arguement: ${process.argv[2]} does not match possible commands`);
            break;
    }
} else {
    console.error(`No argument provided`);
}