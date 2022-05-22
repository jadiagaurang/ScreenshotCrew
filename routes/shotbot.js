#! /usr/bin/env node

"use strict";

// External Packages
const express = require("express");
var router = express.Router();
const _ = require("underscore");

// Internal Modules
const winston = require("../src/logger").winston;
const ShotBot = require("../src/shotbot.js");
const util = require("../src/utility.js");
var meLogger = winston(process.env.LOG_LEVEL);

/* GET */
router.get("/capture/:fileFormat", function (req, res) {
	doCapture(req, res, req.params.fileFormat);
});
/* POST */
router.post("/capture/:fileFormat", function (req, res) {
	doCapture(req, res, req.params.fileFormat);
});

/* GET: To fetch Locally stored screenshot */
router.get("/screenshot/:screenshotName", function(req, res) {
    var objShotBot = new ShotBot();
    objShotBot.fetchScreenshot(req, res, req.params.screenshotName);
});

//Routing Callback
const doCapture = async (req, res, fileFormat) => {
    try {
        //Get Web Page URL from the Request
        var varURL = req.query.url;    //Try to get it from Query String
        if (util.isBlank(varURL)) {
            varURL = req.body.url;     //Try to get it from Request Body
        }

        if (util.isBlank(varURL)) {
            throw new Error("Invalid URL");
        }

        if (util.isBlank(fileFormat)) {
            fileFormat = "image";
        }
        else if (!_.contains(["image", "pdf"], fileFormat)) {
            fileFormat = "image";
        }

        try {
            var strKey = "URL:" + varURL.toLowerCase() + "&fileFormat" + fileFormat;

            var varCachedResult = await util.getCachedResult(strKey);

            if (varCachedResult != null) {
                // Response Back from the Cache
                res.write(JSON.stringify(varCachedResult));

                // Set Response Header for Debugging
                res.writeHead(200, { "Content-Type": "application/json", "X-Cache": "HIT" });
                
                // End the Response
                res.end();
            }
            else {
                try {
                    let options = {
                        "fileFormat": fileFormat
                    };

                    if (!util.isBlank(req.query.width) && !isNaN(req.query.width)) {
                        options["width"] = parseInt(req.query.width, 10);
                    }
                    else if (!util.isBlank(req.body.width) && !isNaN(req.body.width)) {
                        options["width"] = parseInt(req.body.width, 10);
                    }

                    if (!util.isBlank(req.query.height) && !isNaN(req.query.height)) {
                        options["height"] = parseInt(req.query.height, 10);
                    }
                    else if (!util.isBlank(req.body.height) && !isNaN(req.body.height)) {
                        options["height"] = parseInt(req.body.height, 10);
                    }

                    if (!util.isBlank(req.query.pageSize)) {
                        options["pageSize"] = req.query.pageSize;
                    }
                    else if (!util.isBlank(req.body.pageSize)) {
                        options["pageSize"] = req.body.pageSize;
                    }

                    // ShotBot Module Object
                    let objShotBot = new ShotBot(varURL, options);

                    // Generate Screenshot
                    let outputResponse = await objShotBot.getScreenshot();

                    var blnResult = await util.setCachedResult(strKey, outputResponse);
                    if (!blnResult) {
                        meLogger.error("MemcachedClient Set Exception at " + (new Date()));
                    }

                    //Set Response ContentType
                    res.writeHead(200, { "Content-Type": "application/json", "X-Cache": "MISS" });

                    //Write Output
                    res.write(JSON.stringify(outputResponse));
                    res.end();
                }
                catch(innerException) {
                    meLogger.error(innerException);

                    //Set Response ContentType
                    res.writeHead(500, {"Content-Type": "application/json"});

                    //Write Output
                    res.write(JSON.stringify({
                        "Status": "ERROR",
                        "Message": innerException
                    }));
                    res.end();

                    return;
                }
            }
        }
        catch (ex) {
            meLogger.error(ex);

            throw ex;
        }
    }
    catch (outerException) {
        meLogger.error(outerException);

        res.writeHead(500, {"Content-Type": "application/json"});
        res.write(JSON.stringify({
          "Status": "ERROR",
          "Message": outerException
        }));
        res.end();

        return;
    }
}

module.exports = router;