$(function() {
  $("#btnScrape").on("click", (event) => {
    console.log("scrape button clicked");
    window.location = "/api/scrape";
    // $.ajax("/api/scrape", {
    //   type: "GET"
    // }).then(() => {
    //   console.log("Scraped data");
    //   window.location = "/api/scrape";
    // });
  });

})



