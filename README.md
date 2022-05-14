# ScreenshotCrew

[![Node.js CI](https://github.com/jadiagaurang/ScreenshotCrew/actions/workflows/node.js.yml/badge.svg)](https://github.com/jadiagaurang/ScreenshotCrew/actions/workflows/node.js.yml)
[![Docker Image CI](https://github.com/jadiagaurang/ScreenshotCrew/actions/workflows/docker-image.yml/badge.svg)](https://github.com/jadiagaurang/ScreenshotCrew/actions/workflows/docker-image.yml)
[![Docker pulls](https://img.shields.io/docker/pulls/jadiagaurang/screenshotcrew.svg?logo=docker)](https://hub.docker.com/r/jadiagaurang/screenshotcrew/)

ScreenshotCrew is an open-source screenshot as a service using [Puppeteer headless browser](https://github.com/puppeteer/puppeteer). Using Node.js, [Puppeteer](https://pptr.dev/) and other plugins, ScreenshotCrew provides utility tool to create screenshot from any web page.

## Motivation
* https://screenshotlayer.com/
* https://urlbox.io/
* https://browshot.com/
* https://screenshotmachine.com/

## Demo
[https://screenshotcrew.com/](https://screenshotcrew.com/)

## API Reference

```bash
curl --location --request GET "https://screenshotcrew.com/api/capture?width=1920&url=https://gaurangjadia.com"
```

```bash
curl --location --request POST "https://screenshotcrew.com/api/capture" --header "Content-Type: application/json" --data-raw "{
    \"width\": 1920,
    \"url\": \"https://gaurangjadia.com\"
}"
```

## Installation
```base
npm install
npm update
```

## Code Example

### PROD
```base
npm start
```

### LOCAL DEV
```base
npm run-script dev
```

## Tests
```base
npm test
```

## License
Please see the [license file](https://github.com/jadiagaurang/ScreenshotCrew/blob/main/LICENSE) for more information.
