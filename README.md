# ScreenshotCrew

[![Node.js CI](https://github.com/jadiagaurang/ScreenshotCrew/actions/workflows/node.js.yml/badge.svg)](https://github.com/jadiagaurang/ScreenshotCrew/actions/workflows/node.js.yml)
[![Docker Image CI](https://github.com/jadiagaurang/ScreenshotCrew/actions/workflows/docker-image.yml/badge.svg)](https://github.com/jadiagaurang/ScreenshotCrew/actions/workflows/docker-image.yml)
[![Docker pulls](https://img.shields.io/docker/pulls/jadiagaurang/screenshotcrew.svg?logo=docker)](https://hub.docker.com/r/jadiagaurang/screenshotcrew/)
[![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/989-3f6c15ce-a69a-42a7-b1e6-cd0b77af0e1c?action=collection%2Ffork&collection-url=entityId%3D989-3f6c15ce-a69a-42a7-b1e6-cd0b77af0e1c%26entityType%3Dcollection%26workspaceId%3D6d1d809a-9f34-443e-90cf-8b7f5c3ba8d4#?env%5BPROD%5D=W3sia2V5IjoiQXBwSG9zdCIsInZhbHVlIjoiaHR0cHM6Ly9zY3JlZW5zaG90Y3Jldy5jb20iLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6Imh0dHBzOi8vc2NyZWVuc2hvdGNyZXcuY29tIiwic2Vzc2lvbkluZGV4IjowfV0=)

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

### Prod

```base
npm start
```

### Local/Develop

```base
npm run-script dev
```

### Docker Container

```base
docker pull jadiagaurang/screenshotcrew
docker run -d -p 80:80 jadiagaurang/screenshotcrew
```

## Tests
```base
npm test
```

## License
Please see the [license file](https://github.com/jadiagaurang/ScreenshotCrew/blob/main/LICENSE) for more information.
