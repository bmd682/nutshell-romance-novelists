let forecast = []
const eventHub = document.querySelector(".container")

const dispatchForecastCaptured = () => {
    const forecastCaptured = new CustomEvent("forecastHasBeenCaptured")
    eventHub.dispatchEvent(forecastCaptured)
}

export const getWeatherData = () => {
    return fetch(`http://api.openweathermap.org/data/2.5/forecast/?zip=37216&units=imperial&appid=ff3c6bcca7fa13fd3098a1ab51d93dd9`)
         .then(response => response.json())
        .then(parsedWeather => {
            forecast = parsedWeather.list
        })
        .then(useWeatherData)
        .then(dispatchForecastCaptured)
}
export const useWeatherData = () => {
      return forecast.slice()
}