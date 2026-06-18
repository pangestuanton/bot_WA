module.exports = {
  name: 'cuaca',
  category: 'utility',
  commands: ['cuaca', 'weather'],
  description: 'Cek cuaca kota',
  cooldown: 10,
  async handler(ctx) {
    const city = ctx.args.join(' ').trim();
    if (!city) {
      await ctx.reply(`Format salah.\nContoh: ${ctx.prefix}cuaca Jakarta`);
      return;
    }

    const weather = await ctx.services.weather.getWeather(city);
    await ctx.reply(`*Cuaca ${weather.city}*\n\nSuhu: ${weather.temperatureC} C\nTerasa seperti: ${weather.feelsLikeC} C\nKelembapan: ${weather.humidity}%\nAngin: ${weather.windKmph} km/jam\nKondisi: ${weather.description}`);
  }
};
