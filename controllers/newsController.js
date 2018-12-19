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
            // console.log(response.data);
            // res.json(response.data);
            var $ = cheerio.load(response.data);
            // console.log($(".moat-trackable").find(".headline" ).first());
            
            // This works...just trying to simplify
            // console.log($(".headline").find("a").first().text());
            // console.log($(".headline").find("a").first().attr("href"));
            // console.log($(".headline").siblings(".blurb").first().text());

            $(".headline").each((i, element) => {
                
                let result = {
                    headline: $(element).find("a").text(),
                    link: $(element).find("a").attr("href")
                };

                let summary = $(element).siblings(".blurb").text();
                if (summary != "") {
                    result.summary = summary;
                } else {
                    summary = $(element).next().find(".blurb").text();
                    // console.log($(element).next().children(".blurb"));
                    if (summary != "") {
                        result.summary = summary;
                    } else {
                        result.summary = "No Summary Available";
                    }
                }

                console.log(result);

            });

            res.send("Have data");
            // var result = {
            //     headline: $("article header").find("a").first().text(),
            //     link: $("article").find("header a").first().attr("href")
            // }

            
            // console.log(result);
        });
});

module.exports = router;
// .find("a").text()