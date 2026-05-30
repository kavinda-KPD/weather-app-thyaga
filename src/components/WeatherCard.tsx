import { useState } from 'react';
import { CityWeather } from '../types/weather';
import './WeatherCard.css';

interface Props {
  data: CityWeather;
}

function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString([], {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function getBgClass(iconCode: string): string {
  if (iconCode.startsWith('01')) return 'bg-clear';
  if (iconCode.startsWith('02') || iconCode.startsWith('03') || iconCode.startsWith('04')) return 'bg-cloudy';
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) return 'bg-rain';
  if (iconCode.startsWith('11')) return 'bg-storm';
  if (iconCode.startsWith('13')) return 'bg-snow';
  return 'bg-mist';
}

export default function WeatherCard({ data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { name, sys, main, weather, wind, coord, dt, visibility, clouds } = data;
  const icon = weather[0]?.icon ?? '01d';
  const description = weather[0]?.description ?? '';
  const bgClass = getBgClass(icon);

  return (
    <div
      className={`weather-card ${bgClass} ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
      aria-expanded={expanded}
    >
      {/* Header */}
      <div className="card-header">
        <div className="city-info">
          <h2 className="city-name">{name}</h2>
          <span className="country-badge">{sys.country}</span>
        </div>
        <div className="header-right">
          <div className="temp-main">{Math.round(main.temp)}°</div>
          <div className="unit-label">C</div>
        </div>
      </div>

      {/* Icon + description row */}
      <div className="card-middle">
        <img
          className="weather-icon"
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
        />
        <div className="middle-info">
          <p className="description">{description.charAt(0).toUpperCase() + description.slice(1)}</p>
          <p className="feels-like">Feels like {Math.round(main.feels_like)}°C</p>
        </div>
        <div className="temp-range">
          <span className="temp-high">↑ {Math.round(main.temp_max)}°</span>
          <span className="temp-low">↓ {Math.round(main.temp_min)}°</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat">
          <span className="stat-icon">💧</span>
          <span className="stat-value">{main.humidity}%</span>
          <span className="stat-label">Humidity</span>
        </div>
        <div className="stat">
          <span className="stat-icon">💨</span>
          <span className="stat-value">{Math.round(wind.speed * 10) / 10} m/s</span>
          <span className="stat-label">Wind {getWindDirection(wind.deg)}</span>
        </div>
        <div className="stat">
          <span className="stat-icon">☁</span>
          <span className="stat-value">{clouds.all}%</span>
          <span className="stat-label">Clouds</span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="expanded-section" onClick={(e) => e.stopPropagation()}>
          <div className="divider" />
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{main.pressure} hPa</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Visibility</span>
              <span className="detail-value">{(visibility / 1000).toFixed(1)} km</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Latitude</span>
              <span className="detail-value">{coord.lat.toFixed(4)}°</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Longitude</span>
              <span className="detail-value">{coord.lon.toFixed(4)}°</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Sunrise</span>
              <span className="detail-value">{formatTime(sys.sunrise)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Sunset</span>
              <span className="detail-value">{formatTime(sys.sunset)}</span>
            </div>
          </div>
          <div className="updated-row">
            <span className="updated-text">
              Updated {formatDate(dt)} at {formatTime(dt)}
            </span>
          </div>
        </div>
      )}

      <div className="expand-hint">{expanded ? '▲ less' : '▼ details'}</div>
    </div>
  );
}