const SUPPORTED_LANGUAGES = new Set(['id', 'en', 'ja', 'ko', 'ar', 'de', 'fr', 'es']);

function parseTtsArgs(args) {
  const first = (args[0] || '').toLowerCase();
  if (SUPPORTED_LANGUAGES.has(first)) {
    return {
      language: first,
      text: args.slice(1).join(' ').trim()
    };
  }

  return {
    language: 'id',
    text: args.join(' ').trim()
  };
}

async function textToSpeech(text, language = 'id') {
  if (!text || text.length > 200) {
    throw new Error('Teks TTS wajib diisi dan maksimal 200 karakter.');
  }

  const url = new URL('https://translate.google.com/translate_tts');
  url.searchParams.set('ie', 'UTF-8');
  url.searchParams.set('client', 'tw-ob');
  url.searchParams.set('tl', language);
  url.searchParams.set('q', text);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  });

  if (!response.ok) {
    throw new Error('Gagal membuat audio TTS. Coba lagi sebentar.');
  }

  return Buffer.from(await response.arrayBuffer());
}

module.exports = { parseTtsArgs, textToSpeech };
