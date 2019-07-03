module.exports = {
    parseDate : function(epochSecInt) {
        return new Date(epochSecInt * 1000);
    }
}