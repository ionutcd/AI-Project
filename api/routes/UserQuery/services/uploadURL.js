const fs = require("fs");
const textract = require("textract");
const UserUpload = require("../../../models/UserUpload");
const BotUpload = require("../../../models/BotUpload");
const { serverInfo } = require("./chat");
const Crawler = require('js-crawler');

const getSingleText = async (url) => {
  return new Promise((resolve, reject) => {
    textract.fromUrl(url, { preserveLineBreaks: false }, (err, page) => {
      resolve(page);
    });
  });
};

const scrapeDatas = async (url, temp) => {
  let final_texts = '';
  let domain = new URL(url);
  domain = domain.hostname;
  return new Promise((resolve, reject) => {
    let crawler = new Crawler().configure({
      ignoreRelative: true,
      depth: 3,
      shouldCrawl: function (url) {
        return url.indexOf(domain) >= 0;
      },
    });
    crawler.crawl({
      url: url,
      success: async function (page) {
        if (
          page.url.includes(domain) == true &&
          page.url.includes('.jpg') == false &&
          page.url.includes('.png') == false &&
          page.url.includes('.zip') == false &&
          page.url.includes('.pdf') == false
        ) {
          // console.log('passed:', page.url);
          const detailedURL = page.url;

          if(detailedURL.includes(temp)) {
            console.log('passed:', detailedURL);
            const scrapedData = detailedURL + await getSingleText(page.url) + "\n" + "\n";
            final_texts += scrapedData;
          }
        }
      },
      failure: function (page) {
        console.log('Error occured:', page.url, 'status:', page.status);
      },
      finished: function (crawledUrls) {
        console.log('All crawling finished', final_texts, 'crawledURLs:', crawledUrls);
        resolve(final_texts);
      },
    });
  });
}

const uploadURL = async (req, res) => {
  try {
    const { url, app_id, org_id } = req.body;
    const path = app_id === null ? "uploads/" + req.token._id : "uploads/chatbot/" + app_id;
    if(!fs.existsSync(path)) {
      fs.mkdirSync(path, {recursive: true})
    }
    const temp = url;
    const texts = await scrapeDatas(url, temp);
    const filepath = `${path}/${Date.now()}.txt`;
    fs.writeFileSync(filepath, texts);
    
    const upload_data = app_id === null ? {
      name: url,
      owner: req.token._id,
      type: "URL",
      size: "1",
      path: filepath,
    } : {
      name: url,
      app_id,
      org_id,
      type: "URL",
      size: "1",
      path: filepath,
    };

    const new_upload = app_id === null ? new UserUpload(upload_data) : new BotUpload(upload_data);

    const result = await new_upload.save();
    serverInfo.restarted = false;
    res.status(200).json({ result });

  } catch (error) {
    res.status(401).json(error.message);
    console.log("err", error);
  }
};

module.exports = uploadURL;
