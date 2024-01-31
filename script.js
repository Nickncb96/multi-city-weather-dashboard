var apiKey = "4557393f83ef3c50705313a9e5378d4e";
// jQuery selectors for various elements
var searchForm = $("#search-form");
var searchInput = $("#search-input");
var historyList = $("#history");
var todaySection = $("#today");
var forecastSection = $("#forecast");
// Flag for temperature unit (Celsius/Fahrenheit)
var isCelsius = true;

// Function to set default city on page load
function setDefaultCity() {
  var defaultCity = "London";
  getCoordinates(defaultCity);
}

// Trigger setDefaultCity function on page load
$(document).ready(function () {
  setDefaultCity();
});

// Event listener for the form submission
searchForm.on("submit", function (event) {
  event.preventDefault();
  var cityName = searchInput.val().trim();

  if (cityName !== "") {
    getCoordinates(cityName);
  }
});

// Event listener for the search button
$("#search-button").on("click", function () {
  var cityName = searchInput.val().trim();

  if (cityName !== "") {
    getCoordinates(cityName);
  }
});

// Event listener for the temperature toggle button
$("#temperature-toggle").on("click", function () {
  isCelsius = !isCelsius; // Toggle the temperature unit flag
  renderWeatherInfo(lastWeatherData.cityName, lastWeatherData); // Re-render weather information with the updated unit
});

// Function to get coordinates for the city
function getCoordinates(city) {
  var coordinateURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

  fetch(coordinateURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found. Please enter a valid city name.");
      }
      return response.json();
    })
    .then((data) => {
      // Extract coordinates and proceed to get weather
      var coordinates = {
        lat: data.coord.lat,
        lon: data.coord.lon
      };
      getWeather(city, coordinates);
    })
    .catch((error) => {
      console.error("Error fetching coordinates:", error);
      alert("An error occurred while fetching data. Please try again later.");
    });
}

// Function to get weather data based on coordinates
function getWeather(city, coordinates) {
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates.lat +
    "&lon=" + coordinates.lon + "&appid=" + apiKey;

  fetch(queryURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching weather data. Please try again later.");
      }
      return response.json();
    })
    .then((data) => {
      // Render weather information, save to history, and update search history
      renderWeatherInfo(city, data);
      saveToLocalStorage(city);
      renderSearchHistory();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching data. Please try again later.");
    });
}

// Function to render weather information
function renderWeatherInfo(city, data) {
  todaySection.empty();
  forecastSection.empty();

  // Render current weather conditions
  renderCurrentWeather(city, data.list[0]);

  // Render 5-day forecast
  for (let i = 1; i < data.list.length; i += 8) {
    renderForecastDay(data.list[i]);
  }

  // Store the last weather data
  lastWeatherData = {
    cityName: city,
    data: data
  };
}

// Function to render current weather conditions
function renderCurrentWeather(city, currentData) {
  var cityName = city;
  var currentDate = dayjs().format('MMMM D, YYYY');
  var iconCode = currentData.weather[0].icon;
  var temperature = isCelsius ? convertTemperatureToCelsius(currentData.main.temp) :
    convertTemperatureToFahrenheit(currentData.main.temp);
  var humidity = currentData.main.humidity;
  var windSpeed = currentData.wind.speed;

  var todayContent = $("<div>").addClass("weather-info");
  todayContent.append($("<h2>").text(cityName + " (" + currentDate + ")"));
  todayContent.append($("<img>").attr("src", "https://openweathermap.org/img/w/" + iconCode + ".png").attr("alt", "Weather Icon"));
  todayContent.append($("<p>").text("Temperature: " + temperature + (isCelsius ? "°C" : "°F")));
  todayContent.append($("<p>").text("Humidity: " + humidity + "%"));
  todayContent.append($("<p>").text("Wind Speed: " + windSpeed + " m/s"));

  todaySection.append(todayContent);
}

// Function to render forecast for a day
function renderForecastDay(dayData) {
  var date = dayjs(dayData.dt_txt).format('MMMM D, YYYY');

  var iconCode = dayData.weather[0].icon;
  var temperature = isCelsius ? convertTemperatureToCelsius(dayData.main.temp) :
    convertTemperatureToFahrenheit(dayData.main.temp);
  var humidity = dayData.main.humidity;

  var forecastContent = $("<div>").addClass("forecast-info");
  forecastContent.append($("<h3>").text(date));
  forecastContent.append($("<img>").attr("src", "https://openweathermap.org/img/w/" + iconCode + ".png").attr("alt", "Weather Icon"));
  forecastContent.append($("<p>").text("Temperature: " + temperature + (isCelsius ? "°C" : "°F")));
  forecastContent.append($("<p>").text("Humidity: " + humidity + "%"));

  forecastSection.append(forecastContent);
}

// Added unit conversion functionality
function convertTemperatureToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}

function convertTemperatureToFahrenheit(kelvin) {
  return ((kelvin - 273.15) * 9 / 5 + 32).toFixed(2);
}

// (unchanged functions...)

historyList.on("click", ".list-group-item", function () {
  var selectedCity = $(this).text();
  getCoordinates(selectedCity);
});

var lastWeatherData;  // Added to store the last weather data

function renderSearchHistory() {
  // Render search history based on the saved cities in localStorage
  var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  historyList.empty();

  for (var i = 0; i < savedCities.length; i++) {
    var historyItem = $("<li>").addClass("list-group-item").text(savedCities[i]);
    historyList.append(historyItem);
  }
}

function saveToLocalStorage(city) {
  // Save the searched city to localStorage
  var savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    localStorage.setItem("cities", JSON.stringify(savedCities));
  }
}