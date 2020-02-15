<h1 align="center">Home Dashboard Weather Manager </h1>
<p align="center">
    <img src="https://travis-ci.com/iamtomhewitt/home-dashboard-weather-manager.svg"/>
    <img src="https://heroku-badge.herokuapp.com/?app=home-dashboard-weather-mngr&style=round&svg=1"/>
</p>
<p align="center">
    ☀ A piggy back API of <a href="https://darksky.net/dev">Darksky</a> to get the weather for my home dashboard.
</p>

## Pipeline
* `Travis` tests the repo using `npm test`, which runs `mocha 'tests/**/*.js' --exit`
* Once the tests pass, `Heroku` deploys the app.
* When the app is deployed, you can make requests to it.

## Endpoints

### `/ (GET)`
* The root endpoint, returning information about the app.

#### Responses
* `200` success
```json
{
    "status": "🌞 SERVER OK",
    "version": "1.0.0",
    "endpoints": [
        {
            "path": "/weather",
            "methods": [
                "GET"
            ]
        },
        {
            "path": "/",
            "methods": [
                "GET"
            ]
        }
    ]
}
```

### `/weather (GET)`
* Gets the weather using latitude and longitude codes.
* Query parameters:
	* `latitude=<latitude>`
	* `longitude=<longitude>`
	* `apiKey=<key>`

#### Responses
* `200` success
```json
{
    "current": {
        "summary": "A summary of the weather",
        "icon": "sunshine",
        "temperature": 15
    },
    "week": [
        {
            "day": "<day>",
            "icon": "cloudy",
            "temperatureLow": 6,
            "temperatureHigh": 10,
        },
        {
            "day": "<day>",
            "icon": "rain",
            "temperatureLow": 4,
            "temperatureHigh": 9,
        },
        ...
    ]
}
```
* `400` bad request if there are missing parameters
```json
{
    "status": 400,
    "message": "There are missing query parameters"
}
```
* `401` unauthorised if api key is incorrect
```json
{
    "status": 401,
    "message": "API key is incorrect"
}
```
* `500` if the weather could not be retrieved
```json
{
    "status": 500,
    "message": "Could not get weather: <error message>"
}
```
