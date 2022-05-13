#! /usr/bin/env node

"use strict";

const winston = require("winston");

const createLogger = (logLevel) => {
    const logger = winston.createLogger({
        levels: winston.config.syslog.levels,
        level: logLevel || "info",
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp({
                format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }),
            //winston.format.align(),
            winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
        )
    });
    
    logger.add(new winston.transports.Console());

    return logger;
};

module.exports = {
    "winston": createLogger
};