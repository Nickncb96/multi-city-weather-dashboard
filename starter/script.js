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

