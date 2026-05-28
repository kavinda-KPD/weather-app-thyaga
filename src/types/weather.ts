export interface WeatherCoord {
  lon: number;
  lat: number;
}

export interface WeatherSys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
}

export interface WeatherClouds {
  all: number;
}

export interface CityWeather {
  coord: WeatherCoord;
  sys: WeatherSys;
  weather: WeatherCondition[];
  main: WeatherMain;
  visibility: number;
  wind: WeatherWind;
  clouds: WeatherClouds;
  dt: number;
  id: number;
  name: string;
}

export interface GroupApiResponse {
  cnt: number;
  list: CityWeather[];
}

export interface CityEntry {
  CityCode: number;
  CityName: string;
}
