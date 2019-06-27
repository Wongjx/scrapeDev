const rp = require('request-promise-native');
const tough = require('tough-cookie');
const cheerio = require('cheerio');
const v8 = require('v8');
const fb = require('./config/fb');

//constants
const fbHomeUrl = 'https://mbasic.facebook.com';

//load html templates
const postShortHtml = require('./postShort');
const pageHtml = require('./page');
const postLongHtml = require('./postLong');
const deviceSaveHtml = require('./device_save');
const loginHtml = require('./login');

function errorLoggging(err) {
    console.error(`Error!`);
    console.error(err);

    //TODO: Let 302 redirects pass without errors

    return;
}
function getAndSetCookies(response, cookieJar) {
    var cookies = [];
    const cookieHeader = response.headers['set-cookie'];
    // if (cookieHeader instanceof Array) {
    //     cookies = cookieHeader.map(tough.parse);
    // } else {
    //     cookies = [tough.parse(cookieHeader)];
    // }
    // console.log(cookies);
    //Set cookies if present
    if (cookieHeader.length > 0) {
        cookieHeader.forEach(cookie => {
            cookieJar.setCookie(cookie,fbHomeUrl,{http:true});
        });
    }
    // cookieJar.setCookie(cookieHeader);
    return cookieJar;
}
function getOptions() {
    return {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
        },
        uri: fbHomeUrl,
        resolveWithFullResponse: true
    };
}

async function scrapeFbPage(pageName) {
    var cookieJar = rp.jar();
    // Load login Screen
    const loginGetOptions = getOptions();
    const loginGetResponse = await rp(loginGetOptions).catch(errorLoggging);
    console.log(`Login Get Headers`);
    console.log(loginGetResponse.headers);
    if (loginGetResponse.statusCode > 200) {
        console.error(`Request Error: Status Code=${loginGetResponse.statusCode}, statusMessage=${loginGetResponse.statusMessage}`);
        return;
    }
    // get cookies and login url
    cookieJar = getAndSetCookies(loginGetResponse, cookieJar);
    const loginPostUrl = parseLogin(loginGetResponse.body);
    console.log(`CookieJar after loginGet`);
    console.log(cookieJar);
    console.log(`LoginPostUrl: ${loginPostUrl}`);

    // Configure login POST request
    const loginPostOptions = getOptions();
    // const postLoginUrl = `https://mbasic.facebook.com/login/device-based/regular/login/?refsrc=https://mbasic.facebook.com/&lwv=100&refid=8`;
    loginPostOptions.uri = fbHomeUrl + loginPostUrl;
    loginPostOptions.jar = cookieJar;
    loginPostOptions.method = 'POST';
    loginPostOptions.form = {
        try_number: 0,
        unrecognized_tries: 0,
        email: fb.email,
        pass: fb.word,
        login: 'Log+In'
    };
    console.log(`LoginPostOptions:`);
    console.log(loginPostOptions);
    // Send Login Post Request
    const loginPostResponse = await rp(loginPostOptions).catch(errorLoggging);
    // console.log(`Login Post Headers`);
    // console.log(loginPostResponse.headers);
    if (loginPostResponse.statusCode > 200) {
        console.error(`Request Error: Status Code=${loginPostResponse.statusCode}, statusMessage=${loginPostResponse.statusMessage}`);
        return;
    }
    console.log(loginPostResponse);

    // const urlToScrape = `${fbHomeUrl}/${pageName}/?ref=page_internal&_rdr`;
    // request(urlToScrape, function(error, response, html) {
    //     //Check to make sure no errors
    //     if (!error) {
    //         const postUrls = parsePage(html);
    //         if (postUrls && postUrls.length > 0) {
    //             console.log(`Scrapping Page: ${fbHomeUrl}${postUrls[0]}`);
    //             request(fbHomeUrl + postUrls[0], function(error, response, html) {
    //                 if (!error) {
    //                     const postText = parseLongPost(html);
    //                     console.log(`Parse Post text: `);
    //                     console.log(postText);
    //                 } else {
    //                     console.error(error);
    //                 }
    //             });
    //         }
    //     } else {
    //         console.error(error);
    //     }
    // })
}

function parseDate(epochSecInt) {
    return new Date(epochSecInt * 1000);
}

function parsePage(htmlString) {
    console.log(`HtmlString: ${htmlString}`);
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
    const postText = $('div[data-ft] > p').text();
    console.log(`parseLongPost end`);
    return postText;
}

function parseLogin(loginHtml) {
    const $ = cheerio.load(loginHtml);
    const url = decodeURIComponent($('#login_form').attr('action'));
    console.log(url);
    return url;
}

function parseDeviceSave(deviceSaveHtml) {
    console.log(`Parse Device Save Start`);

    const $ = cheerio.load(deviceSaveHtml);
    if ($('div > a[href*="save-device"]').get().length > 0) {
        console.log(`On save device page`);
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
            parseLongPost(postLongHtml);
            break;
        case '4':
            console.log('Parsing Login HTML');
            parseLogin(loginHtml);
            break;
        case '5':
            console.log('Parsing Device Save HTML');
            parseDeviceSave(loginHtml);
            break;
        case '6':
            console.log('Parsing Cookies');
            var cookieArray = ['datr=z5EUXSDtdTCtwoltCoged8dS; expires=Sat, 26-Jun-2021 09:52:15 GMT; Max-Age=63072000; path=/; domain=.facebook.com; secure; httponly',
                'sb=z5EUXZ9k50W0HVTW4br9appv; expires=Sat, 26-Jun-2021 09:52:15 GMT; Max-Age=63072000; path=/; domain=.facebook.com; secure; httponly'
            ];
            parseCookies(cookieArray).forEach(cookie => {
                console.log(`Key: ${cookie.key}`);
                console.log(`Value: ${cookie.value}`);

            });
            break;
        default:
            console.log('Arg does not match');
    }
} else {
    parsePage(postShortHtml);
}