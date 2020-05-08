// async recurring job example using a registered service

'use strict';
let {Builder, By, Key, promise, until, Capabilities} = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');
let _ = require('lodash');
let cheerio = require('cheerio');
let chromedriver = require('chromedriver');
const Config = require('../server/config');
const Contract = require('../server/models/contract');
const MongoModels = require('mongo-models');
let posts = [];

function htmlDecodeWithLineBreaks(html) {
    if (!html) {
        return '';
    }
    var breakToken = '_______break_______',
        lineBreakedHtml = html.replace(/<br\s?\/?>/gi, breakToken).replace(/<p\.*?>(.*?)<\/p>/gi, breakToken + '$1' + breakToken);
    return cheerio('<div>').html(html).text();
}

// TODO refactor Contract to job, profession to jobType
async function getContracts(page_link, driver, pageIndex) {
    let contents, button;
    await driver.get(page_link + "&page=" + pageIndex);

    let getVisiblePosts = async function (contents) {
        for (const content of contents) {
            let html = await content.getAttribute('outerHTML');
            let $ = cheerio.load(html);

            let postLink = $('a').attr('href');
            let postTitle = $('a').attr('title');
            posts.push(postLink);
        }
    }

    do {
        await driver.get(page_link + "&page=" + pageIndex);
        try {
            contents = await driver.findElements(
                By.css('.widget.widget-job-list .widget-content > ul >li')
            );

        } catch (exception) {
            console.log('cant getting list jobs ...')
        }
        await getVisiblePosts(contents).catch(ex => {
            console.log('Error: ', ex);
        });
        pageIndex++;
    } while (contents.length);
    // await driver.quit();
}

let options = new chrome.Options();
options.addArguments("--headless");
let page_1 = "http://donhang.vn/tim-kiem-don-hang?CountryId=JP";

async function runCrawler(driver) {
    await getContracts(page_1, driver, 1).catch(ex => {
        console.log(ex);
    });
}

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

async function run() {
    promise.USE_PROMISE_MANAGER = false;

    let mongoConfig = Config.hapiMongoModels.mongodb.connection;

    // connect to db
    const db = await MongoModels.connect({
        uri: mongoConfig.uri,
        db: mongoConfig.db
    });

    if (!db) {
        throw Error('Could not connect to MongoDB.');
    }

    let driver = await new Builder()
        .forBrowser('chrome')
        .withCapabilities(Capabilities.chrome())
        .build();

    await runCrawler(driver);
    // posts = ['/don-hang/tuyen-15-nam-don-hang-lap-dat-tu-dong-lam-viec-tai-saitama---nhat-ban--luong-ve-tay-22---30-trieu-vnd--37',
    // '/don-hang/-tuyen-30-nu-don-hang-dong-goi-cong-nghiep-lam-viec-tai-saitama---nhat-ban--luong-ve-tay-22---30-trieu-vnd--38',
    // '/don-hang/tuyen-6-nam--6-nu-don-hang-lap-rap-dien-tu-lam-viec-tai-toyama---nhat-ban--luong-cam-tay-toi-thieu-17-5-trieu-vnd-thang--39',
    // '/don-hang/tuyen-21-nam-don-hang-nuoi-trong-thuy-san--so-diep--lam-viec-tai-hokkaido---nhat-ban--luong-ve-tay-17---25-trieu-vnd-thang--41',
    // '/don-hang/tuyen-30-nu-don-hang-dong-goi-thuc-pham-lam-viec-tai-iwate---nhat-ban--luong-ve-tay-20---25-trieu-vnd-thang--42',
    // '/don-hang/tuyen-30-nu-dong-goi-cong-nghiep--saitama-nhat-ban-43',
    // '/don-hang/tuyen-gap-9-nu-may-mac-tai-akita--nhat-ban-44',
    // '/don-hang/tuyen-24-nu-che-bien-thuc-pham-1-nam-45',
    // '/don-hang/che-bien-thuc-pham---dong-goi-thit-46',
    // '/don-hang/tuyen-21-nam-che-bien-thuy-san--tai-hokkaido---xuat-canh-som-47'];
    await saveJobs(driver);

    return await driver.quit();
};

/*
    Sample data format
        "title": "string",
        "company": "string",
        "country": "string",
        "working_location": "string",
        "professions": [],
        "salary_range": {
            "from": 0,
            "to": 0
        },
        "require_experience": true,
        "cv_location": "string",
        "submission_deadline": "string",
        "content": "string",
        "required_condition": "string",
        "benefit": "string",
        "quantity": number,
    meta info
        views
        applied
        submit_on
*/
async function _getJobData(driver) {
    try {
        const html = await driver.findElement(
            By.css('.container .row .col-md-8')
        ).getAttribute('outerHTML');
        const $ = cheerio.load(html), result = {};

        // remove all title for easier get content
        $('.summary > ul > li > span').remove();

        result.title = htmlDecodeWithLineBreaks($('.widget-title').html().replace(/<[^>]+>/g, ' '));
        const salary = $('.summary > ul > li:first-child').html().match(/\d+/g);
        result.salary_range = {
            from: salary[0],
            to: salary[1]
        };
        result.require_experience = htmlDecodeWithLineBreaks($('.summary > ul > li:nth-child(2)').html().trim()) == 'Không yêu cầu' ? false : true;
        result.sex = htmlDecodeWithLineBreaks($('.summary > ul > li:nth-child(3)').html().trim());
        result.quantity = parseInt($('.summary > ul > li:nth-child(4)').html().trim());
        result.country = htmlDecodeWithLineBreaks($('.summary > ul > li:nth-child(5)').html().trim()); // TODO need map to code
        result.cv_location = htmlDecodeWithLineBreaks($('.summary > ul > li:nth-child(6)').html().trim()); // nee map to id list
        result.professions_instring = htmlDecodeWithLineBreaks($('.summary > ul > li:nth-child(7)').html().trim());
        result.submission_deadline = $('.summary > ul > li:nth-child(8)').html().trim();
        result.content = htmlDecodeWithLineBreaks($('.widget-content > .main-content:nth-child(2)').html());
        result.required_condition = htmlDecodeWithLineBreaks($('.widget-content > .main-content:nth-child(4)').html());
        result.benefit = htmlDecodeWithLineBreaks($('.widget-content > .main-content:nth-child(6)').html());
        result.broker_id = '000000000000000000000000';
        return result;
    } catch (exception) {
        throw exception;
    }
}

async function saveJobs(driver) {
    for (const post of posts) {
        await driver.get('http://donhang.vn' + post);
        try {
            let data = await _getJobData(driver);
            await Contract.create(data);
        } catch (exception) {
            console.log(exception);
        }
    }
}

run().then(() => {
    console.log(posts);
}).catch(exception => {
    console.log(exception);
});
