"use strict";

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
    res.render("index", { 
        title: "Convert any Web Page to Screenshot Image | ScreenshotCrew"
    });
});

module.exports = router;