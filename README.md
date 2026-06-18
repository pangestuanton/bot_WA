# WhatsApp SuperBot

WhatsApp SuperBot adalah bot WhatsApp modular berbasis Node.js dan Baileys (`sanka-baileyss`). Bot ini memakai arsitektur plugin, middleware permission/rate-limit, storage MVP berbasis memory, dan pesan berbahasa Indonesia.

Fokus utama project ini adalah bot multifitur yang stabil, aman, dan compliance-first. Downloader sengaja nonaktif secara default.

## Fitur Utama

- Core command: `.menu`, `.help`, `.allmenu`, `.ping`, `.profile`, `.rules`
- Sticker tools: `.sticker`, `.s`, `.brat`, `.toimg`, `.meme`
- Group tools: `.welcome`, `.goodbye`, `.antilink`, `.opengroup`, `.closegroup`, `.kick`, `.tagall`
- AI chatbot: `.ai`, `.ask`
- Utility tools: `.tts`, `.calc`, `.cuaca`, `.kurs`, `.lyric`, `.qris`
- Games: `.tebakkata`, `.tod`, `.truth`, `.dare`, `.score`, `.leaderboard`
- Downloader placeholder: `.tiktok`, `.tt`, `.ig`, `.yt`, `.ytmp3`, `.ytmp4`, `.spotify`

## Status Saat Ini

- Plugin loader aktif dan memuat 24 plugin.
- Total command terdaftar: 44 command.
- Downloader tetap disabled by default melalui `.env`.
- Tampilan chat core sudah dibuat lebih rapi dengan helper visual.
- Sticker, group tools, TTS, AI mock, rate limit, dan error handling sudah di-hardening.

## Tech Stack

- Node.js CommonJS
- `sanka-baileyss` untuk koneksi WhatsApp
- `dotenv` untuk konfigurasi
- `pino` untuk logging
- `sharp` untuk pemrosesan gambar/sticker
- `qrcode` untuk QR utility
- `nodemon` untuk development

## Struktur Project

```text
src/
  app.js
  bot/
    client.js
    events.js
    parser.js
    router.js
  config/
    index.js
  middlewares/
    permission.middleware.js
    rate-limit.middleware.js
    safety.middleware.js
    validation.middleware.js
  modules/
    ai/
    core/
    downloader/
    games/
    group/
    sticker/
    utility/
  repositories/
    index.js
  services/
    ai.service.js
    currency.service.js
    game.service.js
    group.service.js
    media.service.js
    tts.service.js
    weather.service.js
  utils/
    helper.service.js
    logger.js
    visual.js
```

## Instalasi

```bash
npm install
```

Salin file environment:

```bash
cp .env.example .env
```

Di Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Konfigurasi Penting

Contoh konfigurasi utama:

```env
APP_NAME="WhatsApp SuperBot"
NODE_ENV=development
BOT_PREFIX=.
OWNER_PHONE=6281234567890
ADMIN_PHONES=6281234567890

ENABLE_STICKER=true
ENABLE_DOWNLOADER=false
ENABLE_AI=true
ENABLE_GROUP_TOOLS=true
ENABLE_GAMES=true
ENABLE_UTILITY=true

RATE_LIMIT_WINDOW_SECONDS=30
RATE_LIMIT_MAX_COMMANDS=8

AI_PROVIDER=mock
AI_API_KEY=
AI_PRIMARY_MODEL=
```

Catatan:

- `ENABLE_DOWNLOADER=false` adalah default yang disarankan.
- Mode `AI_PROVIDER=mock` membuat `.ai` tetap berjalan tanpa API key.
- Untuk AI sungguhan, isi `AI_PROVIDER=openrouter`, `AI_API_KEY`, dan model yang ingin dipakai.
- Jangan commit `.env`, session, upload, temp, log, atau database.

## Menjalankan Bot

Development:

```bash
npm run dev
```

Production/manual:

```bash
npm start
```

Saat pertama kali berjalan, terminal akan menampilkan QR login WhatsApp. Scan QR dari aplikasi WhatsApp.

## Validasi

Cek sintaks entrypoint utama:

```bash
npm run lint
```

Cek semua file JavaScript di `src`:

```powershell
Get-ChildItem -Path src -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

## Command Populer

```text
.menu
.ping
.profile
.rules
.sticker
.brat halo dunia
.meme TEKS ATAS | TEKS BAWAH
.toimg
.ai buat caption promosi singkat
.tts id halo semuanya
.calc (10+5)*2
.cuaca Jakarta
.kurs 10 USD IDR
.tebakkata
.tagall pengumuman penting
.antilink on warn
.antilink on kick
```

## Permission dan Keamanan

- Command admin grup memakai `adminOnly` dan `groupOnly`.
- `.kick`, `.opengroup`, dan `.closegroup` membutuhkan bot menjadi admin.
- Rate limit aktif per user.
- Safety middleware menolak permintaan berisiko seperti spam massal dan bypass DRM.
- Error command dikirim sebagai pesan Indonesia yang aman dibaca user.

## Kebijakan Downloader

Downloader belum diimplementasikan sebagai pengunduh aktif dan tetap disabled secara default. Jika suatu saat diaktifkan, fitur ini hanya boleh untuk:

- Konten publik yang memang boleh diunduh.
- Konten milik sendiri.
- Konten yang sudah mendapat izin.
- Metadata atau workflow yang tidak melanggar hak cipta, DRM, paywall, atau privasi.

Bot ini tidak boleh digunakan untuk pembajakan, bypass DRM, scraping konten private, atau distribusi ulang konten tanpa izin.

## Catatan Pengembangan

Untuk menambah fitur, buat file plugin baru di dalam `src/modules/<kategori>/`.

Format dasar plugin:

```js
module.exports = {
  name: 'nama-plugin',
  category: 'utility',
  commands: ['command'],
  description: 'Deskripsi fitur',
  cooldown: 5,
  async handler(ctx) {
    await ctx.reply('Pesan dalam bahasa Indonesia.');
  }
};
```

Gunakan service di `src/services` untuk logic yang reusable, dan gunakan middleware untuk validasi permission, rate limit, serta safety.

## Lisensi

Project pribadi untuk pengembangan WhatsApp bot modular. Gunakan secara bertanggung jawab dan ikuti aturan platform yang berlaku.
