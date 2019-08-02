const fs = require('fs');
const path = require('path');
const credentials = require('../config/google');
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
    const response = await sheets.spreadsheets.batchUpdate(getAddSheetRequest(SHEET_TITLE))
    .catch((err) => {
        console.error(err);
    });
    if(!response){
        console.error(`Error: Add Sheet Request Failed`);
        return;
    }
    const insertValueRequest = {
        spreadsheetId: credentials.sheets.sheet_id, 
        resource: {
          // How the input data should be interpreted.
          valueInputOption: 'USER_ENTERED',  
          data: [
              getHeaderDataObj(SHEET_TITLE,'B1',durianTypes),
              getVendorRowDataObj(SHEET_TITLE,'A2',vendorPrices)
            ]
        }
    };
    const insertValueRes = await sheets.spreadsheets.values.batchUpdate(insertValueRequest)
    .catch((err) => {
        console.error(err);
    })
    console.log("Done!");    
}
function getSheetTitle(){
    return new Date().toLocaleDateString();
}
function getDataObj(sheetTitle, startCell, majorDimension, values){
    return {
        "range": `${sheetTitle}!${startCell}`,
        "majorDimension": majorDimension,
        "values": values
      }
}
function getHeaderDataObj( sheetTitle, startCell, values){
    return getDataObj( sheetTitle, startCell, 'ROWS',[values]);
}
function getVendorRowDataObj( sheetTitle, startCell, values){
    return getDataObj( sheetTitle, startCell, 'ROWS',values);
}

function getAddSheetRequest(sheetTitle) {
    return {
        spreadsheetId: credentials.sheets.sheet_id,
        resource: { requests: [{
             addSheet: { properties: { title: sheetTitle } } 
            }] 
        }
    };
}
module.exports = {authorize, addPriceSheet};