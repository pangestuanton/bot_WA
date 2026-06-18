# AGENTS.md — Instruksi untuk AI Coding Agent

## 1. Peran

Kamu adalah AI coding agent yang membangun **WhatsApp SuperBot** berbasis Node.js dengan fitur:

- Sticker tools
- AI tools
- Group admin tools
- Fun games
- Utility tools
- Downloader terbatas/compliance-first

---

## 2. Aturan Utama

- Gunakan arsitektur modular/plugin.
- Jangan buat satu file besar.
- Gunakan `.env` untuk konfigurasi.
- Jangan commit `.env`, session, upload, temp, dan database.
- Pesan bot menggunakan bahasa Indonesia.
- Downloader default harus nonaktif.
- Jangan implementasikan fitur spam massal.
- Jangan implementasikan bypass DRM, paywall, private content scraping, atau pembajakan lagu/video.
- Public lookup hanya data publik.
- Voice changer gunakan efek generik, bukan impersonasi orang nyata.
- Anonymous chat wajib punya stop/report/block.

---

## 3. Prioritas Implementasi

Urutan terbaik:

1. Setup project Node.js.
2. Buat struktur folder.
3. Buat WhatsApp client.
4. Buat parser command.
5. Buat middleware rate limit dan permission.
6. Buat plugin loader.
7. Implement `.menu` dan `.ping`.
8. Implement sticker tools:
   - `.sticker`
   - `.brat`
   - `.toimg`
   - `.meme`
9. Implement group tools:
   - welcome
   - goodbye
   - anti-link
   - kick
   - tagall
10. Implement AI chatbot.
11. Implement utility:
   - `.tts`
   - `.calc`
12. Implement games.
13. Implement database.
14. Implement logs.
15. Implement downloader restricted jika core sudah stabil.

---

## 4. Definition of Done

Fitur selesai jika:
- Command berjalan.
- Error handling ada.
- Validasi input ada.
- Permission aman.
- Rate limit aktif.
- Tidak membuat bot crash.
- Sesuai PRD.
- Bisa dites manual.
- Tidak melanggar COMPLIANCE.md.

---

## 5. Prompt Siap Tempel ke Coding Agent

```text
Build a modular Node.js WhatsApp SuperBot based on the provided documentation. Use whatsapp-web.js, CommonJS, dotenv, a plugin-based command architecture, middleware for rate limiting and permission checks, and SQLite/JSON storage for MVP. Implement core commands (.menu, .ping), sticker tools (.sticker, .brat, .toimg, .meme), group tools (welcome, goodbye, anti-link, kick, tagall with admin-only checks), AI chatbot with provider adapter and cooldown, utility tools (.tts, .calc), game foundation, logging, and safe error handling. Keep downloader modules disabled by default and only implement compliance-first placeholders unless explicitly configured. Do not implement spam, DRM bypass, private content scraping, or piracy-related behavior. Keep all user-facing bot messages in Indonesian.
```
