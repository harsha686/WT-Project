document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const cityInput = document.getElementById('cityinput');
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    const loading = document.querySelector('.loading');
    loading.style.display = 'block';
    
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=629115b57248eccb4c8fe90950aa1de9`
        );
        
        if (!response.ok) throw new Error('City not found');
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        showError(error.message);
    } finally {
        loading.style.display = 'none';
    }
});

function updateUI(data) {
    const weatherInfo = document.querySelector('.weather-info');
    const iconCode = data.weather[0].icon;
    
    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temp-value').textContent = Math.round(data.main.temp);
    document.getElementById('description').textContent = data.weather[0].main;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('visibility').textContent = `${data.visibility/1000} km`;
    
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@4x.png" alt="Weather icon">`;
    
    weatherInfo.style.display = 'block';
    updateBackground(data.weather[0].main);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.search-section').appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

function updateBackground(condition) {
    const body = document.body;
    const conditions = {
        Clear: 'linear-gradient(135deg, #56CCF2, #2F80ED)',
        Clouds: 'linear-gradient(135deg, #BBD2C5, #536976)',
        Rain: 'linear-gradient(135deg, #005C97, #363795)',
        Snow: 'linear-gradient(135deg, #E6DADA, #274046)',
        Thunderstorm: 'linear-gradient(135deg, #1A1A1A, #4B4B4B)'
    };
    body.style.background = conditions[condition] || 'linear-gradient(135deg, #667eea, #764ba2)';
}