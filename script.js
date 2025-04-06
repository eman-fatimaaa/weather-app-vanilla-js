const API_KEY = "776ff3222f9a4d3994a181052250604"; 
const DEFAULT_CITY = "Paris";

// Utility function to fetch weather
const fetchWeather = async (location) => {
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=yes`;
  try {
    document.querySelector(".card-title").textContent = "Loading...";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok.");
    const data = await response.json();
    renderWeather(data);
  } catch (error) {
    console.error("Fetch error:", error);
    document.querySelector(".card-title").textContent = "City not found or network error";
    document.querySelector(".card-img").src = "";
    document.querySelectorAll(".list-group-item").forEach((el) => (el.textContent = ""));
  }
};

// Renders weather data to the DOM
const renderWeather = ({
  location: { name: city },
  current: {
    temp_c: temp,
    condition: { icon },
    wind_kph: wind,
    humidity,
    uv,
    feelslike_c: feelslike,
  },
}) => {
  document.querySelector(".card-title").textContent = city;
  document.querySelector(".card-img").src = icon;
  const listItems = document.querySelectorAll(".list-group-item");
  listItems[0].textContent = `Temperature: ${temp}°C`;
  listItems[1].textContent = `Humidity: ${humidity}%`;
  listItems[2].textContent = `Wind: ${wind} kph`;
  listItems[3].textContent = `Feels Like: ${feelslike}°C`;
  listItems[4].textContent = `UV Index: ${uv}`;
};

// Handle manual search
const handleCitySearch = () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    fetchWeather(city);
  }
};

// Initialize with geolocation or fallback
const initWeatherApp = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      (error) => {
        console.warn("Geolocation error, using default city.");
        fetchWeather(DEFAULT_CITY);
      }
    );
  } else {
    fetchWeather(DEFAULT_CITY);
  }
};

document.addEventListener("DOMContentLoaded", initWeatherApp);