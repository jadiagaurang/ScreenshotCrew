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

## Installation
```base
npm install
npm update
```

## Code Example

### Prod
```base
npm start
```

### Local
```base
npm run-script dev
```

## API Reference
```bash
curl --location --request GET "http://localhost:8080/api/capture?url=https://gaurangjadia.com"
```

```bash
curl --location --request POST "http://localhost:8080/api/capture" --header 'Content-Type: application/json' --data-raw '{
    "url": "https://gaurangjadia.com"
}'
```

## Tests
```base
npm test
```

## License
Please see the [license file](https://github.com/jadiagaurang/ScreenshotCrew/blob/main/LICENSE) for more information.
