"use strict";

const express = require("express");
var router = express.Router();

// Load local plugins
const winston = require("../src/logger").winston;
const ShotBot = require("../src/shotbot.js");
const util = require("../src/utility.js");

var meLogger = winston(process.env.LOG_LEVEL);

/* GET */
router.get("/capture", function (req, res) {
	doCapture(req, res);
});
/* POST */
router.post("/capture", function (req, res) {
	doCapture(req, res);
});

/* GET: To fetch Locally stored screenshot */
router.get("/screenshot/:screenshotName", function(req, res) {
    var objShotBot = new ShotBot();
    objShotBot.fetchScreenshot(req, res, req.params.screenshotName);
});

//Routing Callback
function doCapture (req, res) {
    try {
        //Get Web Page URL from the Request
        var varURL = req.query.url;    //Try to get it from Query String
        if (util.isBlank(varURL)) {
            varURL = req.body.url;     //Try to get it from Request Body
        }

        if (util.isBlank(varURL)) {
            throw new Error("Invalid IP");
        }

        try {
            (async() => {
                var strKey = varURL.toLowerCase();

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
                        // ShotBot Module Object
                        var objShotBot = new ShotBot(varURL);

						// Generate Screenshot
                        var outputResponse = await objShotBot.getScreenshot();

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
            })();
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