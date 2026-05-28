import { useEffect, useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { CityWeather } from './types/weather';
import WeatherCard from './components/WeatherCard';
import AddCity from './components/AddCity';
import citiesData from './cities.json';
import './App.css';

export default function App() {
  const { cities, loading, error, fetchCities, fetchSingleCity, refreshAll } = useWeather();
  const [allCities, setAllCities] = useState<CityWeather[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Extract city codes from cities.json on mount
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = (citiesData as any[]).map((c) => c.CityCode as number);
    fetchCities(ids);
  }, [fetchCities]);

  // Sync fetched cities into allCities (preserving manually-added ones)
  useEffect(() => {
    if (cities.length > 0) {
      setAllCities((prev) => {
        // Keep manually-added cities that aren't in the base fetch
        const baseCityIds = new Set(cities.map((c) => c.id));
        const extras = prev.filter((c) => !baseCityIds.has(c.id));
        return [...cities, ...extras];
      });
      setLastUpdated(new Date());
    }
  }, [cities]);

  const handleAddCity = async (cityName: string) => {
    const data = await fetchSingleCity(cityName);
    if (data) {
      setAllCities((prev) => {
        // Avoid duplicates
        if (prev.find((c) => c.id === data.id)) return prev;
        return [...prev, data];
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    refreshAll();
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <div className="app">
      {/* Background blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-area">
            <span className="logo-icon">⛅</span>
            <div>
              <h1 className="app-title">Weatherly</h1>
              <p className="app-subtitle">Live weather across the globe</p>
            </div>
          </div>
          <button
            className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh all cities"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Last updated */}
        {lastUpdated && (
          <p className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {/* Add city */}
        <div className="add-city-section">
          <AddCity onAdd={handleAddCity} />
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        {/* Loading state */}
        {loading && allCities.length === 0 && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p className="loading-text">Fetching weather data…</p>
            <p className="loading-sub">Loading {citiesData.length} cities</p>
          </div>
        )}

        {/* Error state */}
        {error && allCities.length === 0 && (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <h2>Couldn't load weather</h2>
            <p className="error-message">{error}</p>
            {error.includes('Invalid API key') && (
              <p className="error-hint">
                Your API key may still be activating. OpenWeatherMap keys can take up to 2 hours to become active after registration.
              </p>
            )}
          </div>
        )}

        {/* City grid */}
        {allCities.length > 0 && (
          <div className="city-grid">
            {allCities.map((city) => (
              <WeatherCard key={city.id} data={city} />
            ))}
          </div>
        )}

        {/* Summary bar */}
        {allCities.length > 0 && (
          <div className="summary-bar">
            <span>{allCities.length} cities loaded</span>
            <span>·</span>
            <span>
              Avg temp:{' '}
              <strong>
                {Math.round(
                  allCities.reduce((sum, c) => sum + c.main.temp, 0) / allCities.length
                )}°C
              </strong>
            </span>
          </div>
        )}
      </main>

      <footer className="app-footer">
        Powered by <a href="https://openweathermap.org" target="_blank" rel="noreferrer">OpenWeatherMap</a>
      </footer>
    </div>
  );
}
