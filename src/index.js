import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic
function getWeatherZ(zip) {
  let request = new XMLHttpRequest();
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},US&appid=${process.env.API_KEY}`;

  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElements(response, zip);
    }
  });

  request.open("GET", url, true);
  request.send();
}
function getWeather(city) {
  let request = new XMLHttpRequest();
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;

  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElements(response, city);
    }
  });

  request.open("GET", url, true);
  request.send();
}

function getLLFromZip(zip) { 
  let request = new XMLHttpRequest();
  const urlZipToLL = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${process.env.API_KEY}`;

  request.addEventListener("loadend", function() {
    let response = JSON.parse(this.responseText);
    let latInput = response.lat;
    let longInput = response.lon;

    if (this.status === 200) {
      getAirQuality(latInput, longInput);
    }
  });
  request.open("GET", urlZipToLL, true);
  request.send();
}

function getAirQuality(latInput, longInput) {
  let request = new XMLHttpRequest();
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latInput}&lon=${longInput}&appid=${process.env.API_KEY}`;

  request.addEventListener("loadend", function() {
    let response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElementsAQ(response, latInput, longInput);
    }
  });

  request.open("GET", url, true);
  request.send();
}

// UI Logic
function printElementsAQ(apiResponse, latInput, longInput) {
  document.querySelector('#showAirQuality').innerText = `The Air Quality Index at latitude ${latInput} and longitude ${longInput} is ${apiResponse.list[0].main.aqi}!`;
}

function printElements(apiResponse, location) {
  const tempF = Math.round(((apiResponse.main.temp - 273.15) * 9/5 + 32) * 100) / 100;
  document.querySelector('#showResponse').innerText = `The humidity in ${location} is ${apiResponse.main.humidity}%.
  The temperature is ${tempF} degrees Fahrenheit. 
  The visibility is ${apiResponse.visibility} meters.`;
}

function handleFormSubmission(event) {
  event.preventDefault();
  const city = document.querySelector('#location').value;
  document.querySelector('#location').value = null;
  getWeather(city);
}

function handleZipFormSubmission(event) {
  event.preventDefault();
  const zip = document.querySelector('#locationZip').value;
  document.querySelector('#locationZip').value = null;
  getWeatherZ(zip);
}

function handleAQSubmission(e) {
  e.preventDefault();
  const zipAQ = document.querySelector('#airQZ').value;
  document.querySelector('#airQZ').value = null;
  getLLFromZip(zipAQ);
}

window.addEventListener("load", function() {
  document.querySelector('form#city').addEventListener("submit", handleFormSubmission);
  document.querySelector('form#zip').addEventListener("submit", handleZipFormSubmission);
  document.querySelector('form#airQ').addEventListener("submit", handleAQSubmission);
});