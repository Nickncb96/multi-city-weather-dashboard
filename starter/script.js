// Api key 
var apiKey = "4557393f83ef3c50705313a9e5378d4e";
// jQuery varied elements
var searchForm = $("#search-form");
var searchInput = $("#search-input");
var historyList = $("#history");
var todaySection = $("#today");
var forecastSection = $("#forecast");
// temperature unit (Celsius/Fahrenheit)
var isCelsius = true;

// Event listener for the form submission
searchForm.on("submit", function (event) {
  event.preventDefault();
  var cityName = searchInput.val().trim();

  if (cityName !== "") {
    getCoordinates(cityName);
  }
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
  
  