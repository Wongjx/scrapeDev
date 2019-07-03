const repository = require('./repository');
const scrape = require('./scrape');

async function main() {
    const rows = await repository.selectAllVendors();
    rows.forEach(element => {
        console.log(element.FacebookPageName);
    });
}
main();