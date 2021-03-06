var express = require("express");
var logger = require("morgan");
var PORT = process.env.PORT || 8080;
var app = express();

app.use(express.static("public"));

// Parse body of the application as JSON
app.use(logger("dev"));
app.use(express.urlencoded( { extended: true }));
app.use(express.json());

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes
var routes = require("./controllers/newsController.js");
app.use(routes);

app.listen( PORT, () => {
    console.log("Server listening...");
});