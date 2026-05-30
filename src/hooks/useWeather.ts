/// <reference types="vite/client" />
import { useState, useCallback } from "react";
import { CityWeather } from "../types/weather";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string;
const BASE_V25 = "https://api.openweathermap.org/data/2.5";
const BASE_V30 = "https://api.openweathermap.org/data/3.0/onecall";

interface OneCallCurrent {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  weather: { id: number; main: string; description: string; icon: string }[];
}

interface OneCallResponse {
  lat: number;
  lon: number;
  timezone: string;
  current: OneCallCurrent;
}

interface V25WeatherBase {
  id: number;
  name: string;
  coord: { lat: number; lon: number };
  sys: { country: string; type: number; id: number };
}

export interface UseWeatherReturn {
  cities: CityWeather[];
  loading: boolean;
  error: string | null;
  fetchCities: (ids: number[]) => Promise<void>;
  fetchSingleCity: (cityName: string) => Promise<CityWeather | null>;
  refreshAll: () => void;
  lastFetchedIds: number[];
}

function buildCityWeather(
  base: V25WeatherBase,
  oc: OneCallResponse,
): CityWeather {
  return {
    id: base.id,
    name: base.name,
    coord: { lat: oc.lat, lon: oc.lon },
    sys: {
      country: base.sys.country,
      type: base.sys.type,
      id: base.sys.id,
      sunrise: oc.current.sunrise,
      sunset: oc.current.sunset,
    },
    dt: oc.current.dt,
    weather: oc.current.weather,
    main: {
      temp: oc.current.temp,
      feels_like: oc.current.feels_like,
      temp_min: oc.current.temp,
      temp_max: oc.current.temp,
      pressure: oc.current.pressure,
      humidity: oc.current.humidity,
    },
    visibility: oc.current.visibility ?? 10000,
    wind: {
      speed: oc.current.wind_speed,
      deg: oc.current.wind_deg,
    },
    clouds: { all: oc.current.clouds },
  };
}

async function fetchOneCall(
  lat: number,
  lon: number,
): Promise<OneCallResponse> {
  const url =
    `${BASE_V30}?lat=${lat}&lon=${lon}` +
    `&units=metric&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message || `One Call error ${res.status}`,
    );
  }
  return res.json();
}

async function resolveCityById(id: number): Promise<V25WeatherBase> {
  const url = `${BASE_V25}/weather?id=${id}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ||
        `City lookup error ${res.status}`,
    );
  }
  return res.json();
}

async function resolveCityByName(cityName: string): Promise<V25WeatherBase> {
  const url = `${BASE_V25}/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || "City not found");
  }
  return res.json();
}

export function useWeather(): UseWeatherReturn {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedIds, setLastFetchedIds] = useState<number[]>([]);

  const fetchCities = useCallback(async (ids: number[]) => {
    setLoading(true);
    setError(null);
    setLastFetchedIds(ids);
    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          const base = await resolveCityById(id);
          const oc = await fetchOneCall(base.coord.lat, base.coord.lon);
          return buildCityWeather(base, oc);
        }),
      );
      setCities(results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingleCity = useCallback(
    async (cityName: string): Promise<CityWeather | null> => {
      const base = await resolveCityByName(cityName);
      const oc = await fetchOneCall(base.coord.lat, base.coord.lon);
      return buildCityWeather(base, oc);
    },
    [],
  );

  const refreshAll = useCallback(() => {
    if (lastFetchedIds.length > 0) {
      fetchCities(lastFetchedIds);
    }
  }, [lastFetchedIds, fetchCities]);

  return {
    cities,
    loading,
    error,
    fetchCities,
    fetchSingleCity,
    refreshAll,
    lastFetchedIds,
  };
}
