const credentials = require('../config/google');
const utils = require('./utils');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(__dirname, '../config/token.json');

// Load client secrets from a local file.
// authorize(credentials, addNewSheet);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(callback, params) {
    const {client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback, params);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, params);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback, params) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            console.log(TOKEN_PATH);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
                callback(oAuth2Client, params);
            });
        });
    });
    
}

async function addPriceSheet(auth, params) {
    const {durianTypes, vendorPrices} = params;
    if(!auth || !durianTypes || !vendorPrices){
        console.error("Error: Missin Params");
        return;
    }
    const sheets = google.sheets({ version: 'v4', auth });
    const SHEET_TITLE = getSheetTitle();
    // Add additional requests (operations) ...
    const addSheetResponse = await sheets.spreadsheets.batchUpdate(getAddSheetRequest(credentials.sheets.spreadsheet_id, SHEET_TITLE))
    .catch((err) => {
        console.error(err);
    });
    if(!addSheetResponse){
        console.error(`Error: Add Sheet Request Failed`);
        return;
    }
    const sheetId = addSheetResponse.data.replies[0].addSheet.properties.sheetId;
    const updateResponse = await sheets.spreadsheets.batchUpdate(getBatchUpdateCellsRequest(credentials.sheets.spreadsheet_id, sheetId, durianTypes, vendorPrices))
    .catch((err) => {
        console.error(err);
    });
    if(!updateResponse){
        console.error(`Error: Batch Update Cells Request Failed`);
        return;
    }
    console.log("Done!");    
}
function getSheetTitle(){
    return utils.parseDateAndReturnInLocaleString((Date.now()/1000));
}
function getAddSheetRequest(spreadsheetId, sheetTitle) {
    return {
        spreadsheetId: spreadsheetId,
        resource: { requests: [
                {
                    addSheet: { properties: { title: sheetTitle } } 
                }
            ] 
        }
    };
}
function getValue(cellValue, note){
    if(note){
        return {
            userEnteredValue:{
                stringValue: cellValue
            },
            note: note
        }
    } else {
        return {
            userEnteredValue:{
                stringValue: cellValue
            }
        }
    }
}
function getHeaderRow(durianTypes){
    return {
        values: [getValue()].concat(durianTypes.map((durian)=>{
            return getValue(durian);
        }))
    };
}
function getVendorRow(vendorValues){
    const values = [getValue(vendorValues.vendorName)];
    // console.log(vendorValues);
    return {
        values : values.concat(vendorValues.prices.map((price)=>{
            if(price){
                return getValue(price.pricePerKilo, 'Last Updated: '+price.postDate);
            } else {
                return getValue("0");
            }
        }))
    };
}
function getBatchUpdateCellsRequest(spreadsheetId, sheetId, durianTypes, vendorPrices){
    var rows = [getHeaderRow(durianTypes)];
    rows = rows.concat(vendorPrices.map((vendorPrice)=>{return getVendorRow(vendorPrice);}));
    return {
        spreadsheetId: spreadsheetId,
        resource: {
            requests: [
                {
                    updateCells : {
                        fields: "*",
                        rows: rows,
                        start: {
                            sheetId: sheetId,
                            columnIndex: 0,
                            rowIndex: 0
                        }
                    }
                }
            ]
        }
    }
}
module.exports = {authorize, addPriceSheet};