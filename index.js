const rp = require('request-promise-native');
const tough = require('tough-cookie');
const cheerio = require('cheerio');
const v8 = require('v8');
const fb = require('./config/fb');

//constants
const fbHomeUrl = 'https://mbasic.facebook.com/';

//load html templates
const postShortHtml = require('./postShort');
const pageHtml = require('./page');
const postLongHtml = require('./postLong');
const postStoryHtml = require('./postStory');
const deviceSaveHtml = require('./device_save');
const loginHtml = require('./login');

function errorLoggging(err) {
    console.error(`Error!`);
    console.error(err);
    //TODO: Let 302 redirects pass without errors
    throw err;
}
function getDefaultRequestPromise() {
    const cookieJar = rp.jar();
    function getAndSetCookies(body, response, resolveWithFullResponse) {
        const cookieHeader = response.headers['set-cookie'];
        //Set cookies if present
        if (cookieHeader && cookieHeader.length > 0) {
            cookieHeader.forEach(cookie => {
                cookieJar.setCookie(cookie,fbHomeUrl,{http:true});
            });
        }
        return body;
    }
    const defaultOptions = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
        },
        jar:cookieJar,
        baseUrl : fbHomeUrl,
        resolveWithFullResponse: true,
        followAllRedirects : true,
        transform:getAndSetCookies
    };
    return rp.defaults(defaultOptions);
}
async function scrapeFbPage(pageName) {
    // Load login Screen
    const defaultRequest = getDefaultRequestPromise();
    console.log(`Get Login Page`);
    const loginGetResponseBody = await defaultRequest('').catch(errorLoggging);
    if(!loginGetResponseBody){
        return;
    }
    // get cookies and login url
    const loginPostUrl = parseLogin(loginGetResponseBody);
    console.log(`LoginPostUrl: ${loginPostUrl}`);
    // Configure login POST request
    const loginPostOptions = {
        uri: loginPostUrl[0],
        method: 'POST',
        form: {
            try_number: 0,
            unrecognized_tries: 0,
            email: fb.email,
            pass: fb.word,
            login: 'Log+In'
        }
    };
    if(loginPostUrl.length>1){
        loginPostOptions.qs=loginPostUrl[1];
    }
    // Send Login Post Request
    console.log(`Submit Login Form`);
    const loginPostResponse = await defaultRequest(loginPostOptions).catch(errorLoggging);
    if(!loginPostResponse){
        return;
    }
    // parse page for url to cancel device save
    // console.log(loginPostResponse);
    const saveDeviceCancelUrl = parseDeviceSave(loginPostResponse);
    if(!saveDeviceCancelUrl){
        return;
    }
    // Cancel Device Save 
    console.log(`Cancel Device Save`);
    const deviceSaveCancelGetResponse = await defaultRequest(saveDeviceCancelUrl).catch(errorLoggging);
    if(!deviceSaveCancelGetResponse){
        return;
    }
    // navigate to fb page to scrape
    console.log(`Go to fb page`);
    const urlToScrape = `/${pageName}/?ref=page_internal&_rdr`;
    const pageGetResponse = await defaultRequest(urlToScrape).catch(errorLoggging);
    if(!pageGetResponse){
        return;
    }
    const postUrls = parsePage(pageGetResponse);
    //scrape individual posts
    console.log(`Go to fb post`);
    if (postUrls && postUrls.length > 0) {
        console.log(`Scrapping Page: ${fbHomeUrl}${postUrls[0]}`);
        const postResponse = await defaultRequest(postUrls[0]).catch(errorLoggging);
        // console.log(postResponse);
        if(!postResponse){
            return;
        }
        const postText = parseLongPost(postResponse);
        console.log(postText);
    }
}

function parseDate(epochSecInt) {
    return new Date(epochSecInt * 1000);
}

function parsePage(htmlString) {
    console.log(`parsePage start`);
    const $ = cheerio.load(htmlString);
    // select all posts from divs containing attribute:data-ft=top_level_post_id OR role=article
    var postUrls = [];
    $('div[data-ft*="top_level_post_id"]').each(function(index) {
        const $post = $(this);
        // get datetime from converting attribute:data-ft[publish-time] from epoch-time 
        const data = JSON.parse(($post.attr('data-ft')));
        const pageId = data['page_id'];
        const postEpochTime = data['page_insights'][pageId]['post_context']['publish_time'];
        const postTime = parseDate(postEpochTime);
        // TODO: if not avalible, do parse_date2 from abbr tag text
        // get post url
        const postUrl = $post.find('a[href*="footer"]').attr('href');
        console.log(`Post date : ${postTime.toLocaleString()}`);
        console.log(`Post URL: ${postUrl}`);
        postUrls.push(postUrl);
    });
    console.log(`parsePage end`);
    return postUrls;
}

function parseLongPost(postHtml) {
    console.log(`parseLongPost start`);
    // get full post text from all <p>s in a div containing attribute:data-ft
    const $ = cheerio.load(postHtml);
    console.log(`Load finish`);
    if($('div[data-ft] > p').get().length>0){
        // console.log($('div[data-ft] > p'));
        return $('div[data-ft] > p').text();
    } else {
        // console.log($('div[data-ft] > div > div > div > span'));
        return $('div[data-ft] > div > div > div > span').text();
    }
}

function parseLogin(loginHtml) {
    const $ = cheerio.load(loginHtml);
    const url = decodeURIComponent($('#login_form').attr('action'));
    if(url.indexOf('?'!=-1)){ //contains querystring
        var queryString = url.substring(url.indexOf('?')+1);
        var path = url.substring(0,url.indexOf('?'));
        return [path,queryString];
    } else {
        return [url];
    }
}

function parseDeviceSave(deviceSaveHtml) {
    console.log(`Parse Device Save Start`);
    const $ = cheerio.load(deviceSaveHtml);
    if ($('div > a[href*="save-device"]').get().length > 0) {
        console.log(`On save device page`);
        // Get cancel option url
        const saveDeviceCancelUrl = $('a[href*="cancel"]').attr('href');
        console.log(`Save Device Cancel Href: ${saveDeviceCancelUrl}`);
        return saveDeviceCancelUrl;
    } else {
        console.log(`Wrong Page`);
    }
    console.log(`Parse Device Save End`);
}

//Test
if (process.argv[2]) {
    switch (process.argv[2]) {
        case '0':
            const pageName = process.argv[3];
            console.log(`Scrapping page ${pageName}`);
            if (pageName) {
                scrapeFbPage(pageName);
            } else {
                console.log(`Missing page name arguement`);
            }
            break;
        case '1':
            console.log('Parsing Page HTML');
            parsePage(pageHtml);
            break;
        case '2':
            console.log('Parsing Short Post HTML');
            parsePage(postShortHtml);
            break;
        case '3':
            console.log('Parsing Long Post HTML');
            console.log(parseLongPost(postLongHtml));
            break;
        case '4':
            console.log('Parsing Login HTML');
            parseLogin(loginHtml);
            break;
        case '5':
            console.log('Parsing Device Save HTML');
            parseDeviceSave(deviceSaveHtml);
            break;
        case '6':
            console.log('Parsing Story Post HTML');
            console.log(parseLongPost(postStoryHtml));
            break;
        default:
            console.log('Arg does not match');
    }
} else {
    parsePage(postShortHtml);
}