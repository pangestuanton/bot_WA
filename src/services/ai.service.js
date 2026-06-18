async function callOpenRouter({ apiKey, model, prompt }) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah Antoniqueee Bot. Jawab dalam bahasa Indonesia, singkat, jelas, ramah, dan membantu.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return {
    text: data.choices?.[0]?.message?.content?.trim() || 'Maaf, AI sedang belum bisa memberi jawaban.',
    usage: data.usage || {}
  };
}

async function askAI({ config, repositories, sender, prompt }) {
  if (config.aiProvider === 'mock') {
    repositories.aiUsage.add({
      userPhone: sender,
      provider: 'mock',
      model: 'local-mock',
      feature: 'chat',
      inputTokens: prompt.length,
      outputTokens: 0
    });
    return 'Mode AI mock aktif. Atur AI_PROVIDER=openrouter, AI_API_KEY, dan model di .env untuk jawaban AI sungguhan.';
  }

  if (!config.aiApiKey) {
    throw new Error('AI_API_KEY belum diatur.');
  }

  const models = [
    config.aiPrimaryModel,
    config.aiFallbackModel,
    config.aiThirdModel,
    config.aiFreeRouterModel
  ].filter(Boolean);

  if (!models.length) {
    throw new Error('Model AI belum diatur di .env.');
  }

  let lastError = null;

  for (const model of models) {
    try {
      const result = await callOpenRouter({ apiKey: config.aiApiKey, model, prompt });
      repositories.aiUsage.add({
        userPhone: sender,
        provider: config.aiProvider,
        model,
        feature: 'chat',
        inputTokens: result.usage.prompt_tokens || prompt.length,
        outputTokens: result.usage.completion_tokens || result.text.length
      });
      return result.text;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(lastError ? 'AI sedang sibuk atau model tidak tersedia.' : 'AI belum bisa digunakan sekarang.');
}

module.exports = { askAI };
