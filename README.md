# Weatherly — Weather Dashboard

A React + TypeScript weather app built with Vite, using the OpenWeatherMap API.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your API key**
   The `.env` file is already included with your key. If needed, edit it:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```
   > ⚠️ API keys can take up to 2 hours to activate after registration.

3. **Add your cities.json**
   Replace `src/cities.json` with your downloaded file from the assignment.
   The file must be an array with objects containing a `CityCode` field:
   ```json
   [
     { "CityCode": 1248991, "CityName": "Colombo" },
     { "CityCode": 2643743, "CityName": "London" }
   ]
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

5. **Build for production**
   ```bash
   npm run build
   ```

## Features

- Loads all cities from `cities.json` automatically on startup
- Fetches live weather from OpenWeatherMap group API
- Click any card to expand full weather details
- Add new cities by name using the search bar
- Refresh all cities with the Refresh button
- Responsive — works on desktop and mobile
- Weather-themed card colors (clear, cloudy, rain, storm, snow, mist)

## Project Structure

```
src/
├── cities.json          ← your city codes
├── types/
│   └── weather.ts       ← TypeScript interfaces for API response
├── hooks/
│   └── useWeather.ts    ← data fetching logic
├── components/
│   ├── WeatherCard.tsx  ← individual city card
│   ├── WeatherCard.css
│   ├── AddCity.tsx      ← add new city input
│   └── AddCity.css
├── App.tsx              ← main app layout
├── App.css
└── main.tsx             ← entry point
```

## API Used

`GET https://api.openweathermap.org/data/2.5/group`

Parameters: `id` (comma-separated city IDs), `units=metric`, `appid=YOUR_KEY`

For cities added via search: `GET /data/2.5/weather?q=CITY_NAME&units=metric&appid=YOUR_KEY`
