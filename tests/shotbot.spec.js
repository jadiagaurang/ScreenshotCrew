#! /usr/bin/env node

"use strict";

const supertest = require("supertest");
const assert = require("assert");
const expect = require("chai").expect;
const app = require("../app");

describe("GET /api/capture", function() {
    it("Capture StatusCode 200 OK with screenshotPath not null", function(done) {
        supertest(app)
		.get("/api/capture")
		.query({ "url": "https://gaurangjadia.com" })
		.set("accept", "application/json")
		.expect(200)
		.expect("Content-Type", /json/)
		.end(function(err, res){
			if (err) {
				return done(err);
			}

			expect(res.body.screenshotPath.length).greaterThan(0);

			return done();
		});
	});
});

describe("POST /api/capture", function() {
    it("Capture StatusCode 200 OK with screenshotPath not null", function(done) {
        supertest(app)
		.post("/api/capture")
		.send({ "url": "https://gaurangjadia.com" })
		.set("accept", "application/json")
		.expect(200)
		.expect("Content-Type", /json/)
		.end(function(err, res){
			if (err) {
				return done(err);
			}

			expect(res.body.screenshotPath.length).greaterThan(0);

			return done();
		});
	});
});