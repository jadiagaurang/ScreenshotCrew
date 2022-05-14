#! /usr/bin/env node

"use strict";

// External Packages
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { URL } = require("url");
const AWS = require("aws-sdk");
const _ = require("underscore");
// Internal Modules
const winston = require("./logger").winston;
const util = require("./utility.js");

module.exports = class ShotBot {
	defaultOptions = {
		"width": 1440,
		"height": 1024,
		"isMobile": false
	}

	//Default Constructor
	constructor(strURL, options) {
		var me = this;

		me.options = _.extend({}, me.defaultOptions, options);
		me.logger = winston(process.env.LOG_LEVEL);

		if (!util.isBlank(strURL)) {
			this.objURL = new URL(strURL);
		}
		else {
			this.objURL = null;
		}
		
		this.dimensions = {
			width: 0,
			height: 0
		};

		//Default Values
		this.requestId = uuidv4();
		this.screenshotPath = path.join(path.dirname(fs.realpathSync(__filename)), "../screenshots/");
		this.appServerURL = process.env.APP_SERVER;
	}

	getScreenshot = async () => {
		var me = this;

		me.logger.info("getScreenshot : " + this.objURL);

		const args = ["--disable-setuid-sandbox", "--no-sandbox", "--disable-extensions"];
		const options = {
			args,
			headless: true
		};
		const browser = await puppeteer.launch(options);

		try {
			//Puppeteer Page
			const page = await browser.newPage();

			//Setup Page
			await this.setup(page);

			let imageName = await this.takeScrenshot(page);
			let imageCloudFrontURL = await this.uploadScreenshot(imageName);

			//Close Browser Object
			browser.close();

			if (!util.isBlank(imageCloudFrontURL)) {
				return {
					"screenshotPath": imageCloudFrontURL["FilePath"]
				};
			}
			else {
				return {
					"screenshotPath": this.appServerURL + "/api/screenshot/" + imageName
				};
			}
		}
		catch(ex) {
			browser.close();

			throw ex;
		}
	}
	
	setup = async (page) => {
		var me = this;

		me.logger.info("Setup : " + this.objURL);

		try {
			//Set Viewport
			page.setViewport({
				width: me.options.width,
				height: me.options.height,
				deviceScaleFactor: 1,
				isMobile: me.options.isMobile
			});

			//Setup UserAgent
			const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36";
			await page.setUserAgent(userAgent);

			await page.goto(this.objURL, {
				waitUntil: "networkidle2",
				timeout: 90000	//1.5 minutes
			});

			//Delay 1s
			await util.delay(1000);

			//Scroll to Bottom of the Page to unvail all the lazy/animated content of the page
			await this.scrollToBottom(page);
			await this.scrollToTop(page);

			//Delay 1s
			await util.delay(1000);

			// Get Page's Width and Height to debug wrong section data
			this.dimensions = await page.evaluate(() => {
				return {
					width: Math.max(
						1280,
						Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
						Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
						Math.max(document.body.clientWidth, document.documentElement.clientWidth)
					),
					height: Math.max(
						Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
						Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
						Math.max(document.body.clientHeight, document.documentElement.clientHeight)
					)
				};
			});
		}
		catch(ex) {
			me.logger.error(ex);
		}
	}

	scrollToTop = async (page) => {
		var me = this;

		me.logger.info("scrollToTop : " + this.objURL);

		await page.evaluate(function() {
			window.setTimeout(function () {
				window.scrollTo(0, 0);	//Back to x = 0, y = 0
			}, 250);
		});

		await util.delay(500);
	}

	scrollToBottom = async(page) =>  {
		var me = this;

		me.logger.info("scrollToBottom : " + this.objURL);

		// Scrolling to bottom to load all the lazy loading contents
		await page.evaluate(function() {
			//Figure out Max Height
			var maxHeight = Math.max(
				Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
				Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
				Math.max(document.body.clientHeight, document.documentElement.clientHeight)
			);

			function scrollToBottom(x, iInc, callBack) {
				if (maxHeight > x) {
					window.setTimeout(function () {
						window.scrollTo(0, x + iInc);
						scrollToBottom(x + iInc, iInc, callBack);
					}, 250);
				}
				else {
					if (callBack) {
						callBack();
					}
				}
			}

			scrollToBottom(0, Math.ceil(maxHeight / 10), function () {
				//TODO: Nothing
			});
		});

		//10 Iteration Only each of them will be 250 ms so, 2500 total
		await util.delay(2500);
	}

	takeScrenshot = async (page) => {
		var me = this;

		me.logger.info("takeScrenshot : " + this.objURL);

		//Create Screenshot Directory if doesn't exist?
		if (!fs.existsSync(this.screenshotPath)){
			fs.mkdirSync(this.screenshotPath);
			me.logger.info("takeScrenshot - Making Directory at " + this.screenshotPath);
		}

		let imageName = this.requestId + ".webp";
		let screenshotPath = this.screenshotPath + imageName;

		//FullPage is causing webpage to scale so, adding clip screenshot correctly!
		await page.screenshot({
			path: screenshotPath,
			type: "webp",	// jpeg, png or webp
			quality: 100,
			fullPage: true,
			omitBackground: false,
			encoding: "binary",	//	base64 or binary
			captureBeyondViewport: true,
		});

		return imageName;
	}

	uploadScreenshot = async (imageName) => {
		var me = this;

		if (!util.isBlank(process.env.AWS_ACCESS_KEY_ID) && 
			!util.isBlank(process.env.AWS_SECRET_ACCESS_KEY)) {

			me.logger.info("uploadScreenshot : " + this.objURL);

			let screenshotPath = this.screenshotPath + imageName;

			const s3 = new AWS.S3({
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
			});
		
			// Read content from the file
			let fileContent = fs.readFileSync(screenshotPath);
			let screenshotName = uuidv4();

			// Setting up S3 upload parameters
			const params = {
				Bucket: "",	// TODO: 
				Key: "screenshotcrew/" + screenshotName + ".webp",	// File name you want to save as in S3
				Body: fileContent
			};

			return new Promise(function (resolve, reject) {
				// Uploading files to the bucket
				s3.upload(params, function(err, data) {
					if (err) {
						reject(err);
					}

					resolve(data);
				});
			});
		}
		else {
			return Promise.resolve(null);
		}
	}

	fetchScreenshot = (req, res, imageName) => {
		var me = this;

		me.logger.info("fetchScreenshot: imageName = " + imageName);

		let imagePath = this.screenshotPath + imageName;
	
		//Check if the image exists
		fs.stat(imagePath, function(errOutter, stat) {
			if(errOutter) {
				res.writeHead(500, {"Content-Type": "application/json"});
				res.write(JSON.stringify({
					"Status": "ERROR",
					"Message": "File Not Found",
					"Detail": errOutter
				}));
				res.end();
			}
			else {
				me.logger.info(stat);

				fs.readFile(imagePath, function(errInner, data) {
					if(errInner) {
						res.writeHead(500, {"Content-Type": "application/json"});
						res.write(JSON.stringify({
							"Status": "ERROR",
							"Message": "File Not Found",
							"Detail": errInner
						}));
						res.end();
					}
					else {
						res.writeHead(200, { "Content-Type": "image/webp" });
						res.end(data);
					}
				});
			}
		});
	}
}