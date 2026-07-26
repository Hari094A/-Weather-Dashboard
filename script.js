const apiKey = "46b06d4c56dfbf82a3bcea5f398bb9fe";


const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const themeBtn = document.getElementById("themeBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const weatherIcon = document.getElementById("weatherIcon");
const dateTime = document.getElementById("dateTime");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherCard = document.getElementById("weatherCard");


themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
});


function formatDate() {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };

    return new Date().toLocaleString("en-US", options);
}


function formatTime(unix) {
    return new Date(unix * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

async function getWeather(city) {

    loading.style.display = "block";
    error.style.display = "none";
    weatherCard.style.display = "none";

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        cityName.textContent = `${data.name}, ${data.sys.country}`;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        description.textContent = data.weather[0].description;

        humidity.textContent = `${data.main.humidity}%`;
        wind.textContent = `${data.wind.speed} m/s`;
        feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
        pressure.textContent = `${data.main.pressure} hPa`;
        visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

        sunrise.textContent = formatTime(data.sys.sunrise);
        sunset.textContent = formatTime(data.sys.sunset);

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

        dateTime.textContent = formatDate();

        weatherCard.style.display = "grid";

    } catch (err) {

        error.style.display = "block";
        error.textContent = err.message;

    } finally {

        loading.style.display = "none";

    }

}


searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        error.style.display = "block";
        error.textContent = "Please enter a city.";
        return;
    }

    getWeather(city);

});


cityInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        searchBtn.click();
    }

});

locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        loading.style.display = "block";
        error.style.display = "none";

        try {

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
            );

            const data = await response.json();

            cityInput.value = data.name;

            getWeather(data.name);

        } catch {

            error.style.display = "block";
            error.textContent = "Unable to fetch location.";

        } finally {

            loading.style.display = "none";

        }

    });

});


getWeather("Hyderabad");
