const Masto = require("mastodon-api");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const M = new Masto({
    access_token: config.access_token,
    timeout_ms: 60 * 1000,
    api_url: "https://" + config.api_url + "/api/v1/",
});

function post(screenName, replyId) {
    M.post("statuses", { status: "@" + screenName + " " + config.reply_content, in_reply_to_id: replyId }, (err, data, response) => {
        console.log(JSON.stringify(err, null, "\t"));
    });
}

const streaming = M.stream("streaming/public");
streaming.on("message", (status) => {
    if (status.event === "update" && status.data.content.match(/.https:\/\/t\.co./)) {
        post(status.data.account.acct, status.data.id);
    }
});
streaming.on("error", (err) => {
    console.log(err);
});
