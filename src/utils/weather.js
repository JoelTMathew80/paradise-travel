const weatherCache = new Map();

export const getWeatherMeta = (code) => {
  if (code === 0) return { icon: '☀️', text: 'Clear' };
  if (code <= 3) return { icon: '🌤️', text: 'Partly Cloudy' };
  if (code <= 48) return { icon: '🌫️', text: 'Misty / Fog' };
  if (code <= 67) return { icon: '🌧️', text: 'Rain' };
  if (code <= 77) return { icon: '❄️', text: 'Flurries' };
  if (code <= 82) return { icon: '🌦️', text: 'Showers' };
  if (code <= 99) return { icon: '⛈️', text: 'Thunderstorm' };
  return { icon: '🌡️', text: 'Fair' };
};

export async function fetchWeatherForDest(dest, onLogApi) {
  if (!dest?.coords) return null;
  const key = dest.id;

  if (weatherCache.has(key)) {
    if (onLogApi) {
      onLogApi('GET', `open-meteo.com/v1/forecast?id=${key}`, 'CACHED', 0, 'In-Memory Cache Hit');
    }
    return weatherCache.get(key);
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${dest.coords.lat}&longitude=${dest.coords.lon}&current_weather=true`;
  const startTime = performance.now();

  try {
    const res = await fetch(url);
    const duration = Math.round(performance.now() - startTime);

    if (!res.ok) {
      if (onLogApi) {
        onLogApi('GET', url, res.status, duration, 'Open-Meteo HTTP Error');
      }
      return null;
    }

    const data = await res.json();
    if (onLogApi) {
      onLogApi('GET', url, res.status, duration, 'Open-Meteo Live Forecast');
    }

    const cw = data.current_weather;
    const meta = getWeatherMeta(cw.weathercode);
    const weatherResult = {
      temp: Math.round(cw.temperature),
      wind: cw.windspeed,
      icon: meta.icon,
      text: meta.text,
      time: cw.time
    };

    weatherCache.set(key, weatherResult);
    return weatherResult;
  } catch {
    const failDuration = Math.round(performance.now() - startTime);
    if (onLogApi) {
      onLogApi('GET', url, 'ERR', failDuration, 'Network / CORS Error');
    }
    return null;
  }
}
