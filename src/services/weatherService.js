require('dotenv').config();
const axios = require('axios');
const { format } = require('date-fns');
const getMoonPhaseName = require('../helpers/moonPhase.js');

async function fetchWeatherData(date = new Date()) {
    const apiKey = process.env.VISUAL_CROSSING_API_KEY;
    const lat = process.env.LATITUDE;
    const lon = process.env.LONGITUDE;
    
    // Format the date to 'yyyy-MM-dd'
    const formattedDate = format(date, 'yyyy-MM-dd');
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/${formattedDate}/${formattedDate}?unitGroup=metric&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Extract only one day of data
        const dayData = data.days[0];

        const weather = dayData.conditions;
        const temperatureHigh = dayData.tempmax;
        const temperatureLow = dayData.tempmin;
        const sunrise = dayData.sunrise;
        const sunset = dayData.sunset;
        const moonPhaseValue = dayData.moonphase;
        const moonPhase = getMoonPhaseName(moonPhaseValue);

        return {
            weather,
            temperatureHigh,
            temperatureLow,
            sunrise,
            sunset,
            moonPhase,
        };
    } catch (error) {
        console.error('Error fetching data from Visual Crossing Weather:', error);
        return {};
    }
}

module.exports = fetchWeatherData;