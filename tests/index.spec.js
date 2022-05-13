#! /usr/bin/env node

"use strict";

const supertest = require("supertest");
const assert = require("assert");
const app = require("../app");

describe("GET /", function() {
    it("Index StatusCode 200 OK", function(done) {
        supertest(app)
		.get("/")
		.expect(200)
		.end(function(err, res){
			if (err) done(err);
			done();
		});
	});
});