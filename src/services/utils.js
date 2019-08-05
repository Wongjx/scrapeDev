function parseDate(epochSecInt) {
    return new Date(epochSecInt * 1000);
}
function parseDateAndReturnInLocaleString(epochSecInt){
    const parsedDate = parseDate(epochSecInt);
    return parsedDate.getDate() + "/" + (parsedDate.getMonth() + 1) + "/"+parsedDate.getFullYear();
}
module.exports = {parseDate, parseDateAndReturnInLocaleString};
