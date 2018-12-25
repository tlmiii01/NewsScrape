const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

// Use the Mongoose database modules.
const db = require("../models");

// Connection to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

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

      res.send(articles);
    });
});

// Add a route to add an Article to the database
router.post("/api/article", (req, res) => {
  db.Article.create(req.body)
    .then((dbArticle) => {
      console.log(dbArticle);
    })
    .catch((error) => {
      console.log(error);
    });

    res.send("Data written")
});

// Route to get all of the Articles in the database.
router.get("/articles", (req, res) => {
  db.Article.find({}).then((dbArticle) => {
    res.json(dbArticle);
  })
  .catch((error) => {
    console.log(error);
  });
});

// Route to get one Article
router.get("/articles/:id", (req, res) => {
  db.Article.findOne( {_id: req.params.id })
    .populate("comment")
    .then((dbArticle) => {
      res.json(dbArticle);
    })
    .catch((error) => {
      console.log(error);
    });
});

// Route to add a comment to an article
router.post("/articles/:id", (req, res) => {
  db.Comment.create(req.body)
    .then((dbComment) => {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id},
        { $push: { comment: dbComment._id}},
        { new: true }
      );
    })
    .then( (dbArticle) => {
      res.json(dbArticle);
    })
    .catch((error) => {
      res.json(err);
    });
});

module.exports = router;
