"use strict";

// Load external plugins
const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { createTerminus } = require("@godaddy/terminus")

// Load local plugins
const winston = require("./src/logger").winston;
const routesViews = require("./routes/index");
const routesAPIEndpoints = require('./routes/shotbot');
var meLogger = winston(process.env.LOG_LEVEL);

// ExpressJS App Setup
var app = express();

// Load Environment Variables from the Config File
const args = process.argv;
const fileName = path.dirname(fs.realpathSync(__filename));

// Work on the Args
if (args.length > 2) {
    var objEnv = args[2];
    
    if (objEnv === "prod") {
        dotenv.config({ path: path.join(fileName, "./config/prod.env") });
    }
    else {
        dotenv.config({ path: path.join(fileName, "./config/dev.env") });
    }
}
else {
    dotenv.config({ path: path.join(fileName, "./config/dev.env") });
}

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewave Setup
app.use(favicon(__dirname + "/public/images/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// WebApp and API Route Setup
app.use("/", routesViews);
app.use("/api", routesAPIEndpoints);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers
// development error handler will print stacktrace
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: "Error",
            message: err.message,
            error: err
        });
    });
}

// production error handler no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title: "Error",
        message: err.message,
        error: {}
    });
});

// Port Setup fallback to 3000
app.set("port", process.env.PORT || 3000);

/*
// HttpOptions to accept https connections!
const httpsOptions = {
    key: fs.readFileSync(path.join(path.dirname(fs.realpathSync(__filename)), "./security/private.key")),
    cert: fs.readFileSync(path.join(path.dirname(fs.realpathSync(__filename)), "./security/primary.crt")),
    requestCert: false,
    rejectUnauthorized: false
}
const server = https.createServer(app);
*/

const server = http.createServer(app);

// Health Check
const onSignal = () => {
    meLogger.log("server is starting cleanup");
    return Promise.all([
        // your clean logic, like closing database connections
    ]);
}
  
const onHealthCheck = async ({ state }) => {
    if (!state.isShuttingDown) {
        return Promise.resolve(
            "All Systems Go!"
        )
    }
    else {
        return Promise.reject(
            "Server is shutting down!"
        )
    }
}

createTerminus(server, {
    signal: "SIGINT",
    healthChecks: { "/healthcheck": onHealthCheck },
    onSignal
});

// ExpressJS Server Setup
server.listen(app.get("port"), function () {
    meLogger.info("Express server listening on port " + server.address().port);
});

// Return ExpressJS Server
module.exports = server