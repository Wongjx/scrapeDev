const request = require('request');
const cheerio = require('cheerio');
const postShortHtml = require('./postShort');
const pageHtml = require('./page');
const postLongHtml = require('./postLong');
const deviceSaveHtml = require('./device_save');
const loginHtml = require('./login');

const fbHomeUrl = 'https://mobile.facebook.com';

function scrapeFbPage(pageName) {
    const urlToScrape = `${fbHomeUrl}/${pageName}/?ref=page_internal&_rdr`;
    request(urlToScrape, function(error, response, html) {
        //Check to make sure no errors
        if (!error) {
            const postUrls = parsePage(html);
            if (postUrls && postUrls.length > 0) {
                console.log(`Scrapping Page: ${fbHomeUrl}${postUrls[0]}`);
                request(fbHomeUrl + postUrls[0], function(error, response, html) {
                    if (!error) {
                        const postText = parseLongPost(html);
                        console.log(`Parse Post text: `);
                        console.log(postText);
                    } else {
                        console.error(error);
                    }
                });
            }
        } else {
            console.error(error);
        }
    })
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
        default:
            console.log('Arg does not match');
    }
} else {
    parsePage(postShortHtml);
}
// console.log(parseDate(1560852739));