const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

// Connection to MongoDB
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);

// Home Route
router.get("/", (req, res) => {
    res.send("Home Page");
});

// Route to get to scrape data
const newsSource = "https://www.washingtonpost.com/";
router.get("/api/scrape/", (req, res) => {
    axios.get(newsSource)
        .then((response) => {
            let articles = [];
            var $ = cheerio.load(response.data);

            $(".headline").each((i, element) => {

                let headline = $(element).find("a").text();
                let link = $(element).find("a").attr("href");

                let summary = $(element).siblings(".blurb").text();
                if (summary === "") {
                    summary = $(element).next().find(".blurb").text();
                    if (summary === "") {
                        summary = "No Summary Available";
                    }
                };

                if (headline != "") {
                    // console.log({ headline, link, summary })
                    articles.push({
                        headline,
                        link,
                        summary
                    });
                }
            });

            // console.log(result);
            res.send(articles);
        });
});

module.exports = router;
// .find("a").text()