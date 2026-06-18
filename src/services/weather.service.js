async function getWeather(city) {
  const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
  if (!response.ok) {
    throw new Error('Gagal mengambil data cuaca.');
  }

  const data = await response.json();
  const current = data.current_condition?.[0];
  if (!current) {
    throw new Error('Data cuaca tidak tersedia.');
  }

  return {
    city,
    temperatureC: current.temp_C,
    feelsLikeC: current.FeelsLikeC,
    humidity: current.humidity,
    description: current.weatherDesc?.[0]?.value || 'Tidak diketahui',
    windKmph: current.windspeedKmph
  };
}

module.exports = { getWeather };
