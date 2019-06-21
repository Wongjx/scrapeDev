const request = require('request');
const cheerio = require('cheerio');
const postShortHtml = require('./postShort');
const pageHtml = require('./page');
const postLongHtml = require('./postLong');

const fbHomeUrl = 'https://mobile.facebook.com';

function scrapeWebsite(url) {
    request(url, function(error, response, html) {
        //Check to make sure no errors
        if (!error) {
            var $ = cheerio.load(html);
            console.log($);

        } else {
            console.error(error);
        }
    })
}
// scrapeWebsite(anchorman2Url);
function parseDate(epochSecInt) {
    return new Date(epochSecInt * 1000);
}

function parsePage(htmlString) {
    const $ = cheerio.load(htmlString);
    // select all posts from divs containing attribute:data-ft=top_level_post_id OR role=article
    $('div[data-ft*="top_level_post_id"]').each(function(index) {
        const $post = $(this);
        // get datetime from converting attribute:data-ft[publish-time] from epoch-time 
        const data = JSON.parse(($post.attr('data-ft')));
        const pageId = data['page_id'];
        const postEpochTime = data['page_insights'][pageId]['post_context']['publish_time'];
        const postTime = parseDate(postEpochTime);
        // TODO: if not avalible, do parse_date2 from abbr tag text
        // TODO: if new entry continue crawling to post
        // get post url
        const postUrl = $post.find('a[href*="footer"]').attr('href');
    })
}

function parseLongPost(postHtml) {
    // get full post text from all <p>s in a div containing attribute:data-ft
    const $ = cheerio.load(postHtml);
    const postText = $('div[data-ft] > p').text();
    return postText;
}

//Test
if (process.argv[2]) {
    switch (process.argv[2]) {
        case '0':
            console.log('Parsing Page HTML');
            parsePage(pageHtml);
            break;
        case '1':
            console.log('Parsing Short Post HTML');
            parsePage(postShortHtml);
            break;
        case '2':
            console.log('Parsing Long Post HTML');
            parseLongPost(postLongHtml);
            break;
        default:
            console.log('Arg does not match');
    }
} else {
    parsePage(postShortHtml);
}
// console.log(parseDate(1560852739));