const QUESTIONS = [
  { question: 'Bahasa pemrograman yang berjalan di browser selain JavaScript?', answer: 'typescript', hint: 'Sering ditranspilasi ke JavaScript.' },
  { question: 'Ibu kota Indonesia?', answer: 'jakarta', hint: 'Ada di Pulau Jawa.' }
];

function randomQuestion() {
  return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
}

function createGameService({ repositories }) {
  return {
    startGuess(scopeId, startedBy) {
      const item = randomQuestion();
      return repositories.games.createSession(scopeId, { gameType: 'tebakkata', question: item.question, answer: item.answer, hint: item.hint, startedBy });
    },
    async handleAnswer(parsed, session) {
      if ((parsed.body || '').trim().toLowerCase() !== session.answer.toLowerCase()) {
        return;
      }
      repositories.games.finishSession(session.scopeId, parsed.sender);
      const score = repositories.games.addScore(parsed.sender, session.gameType, 10);
      await parsed.client.sendMessage(parsed.from, { text: `Jawaban benar, ${parsed.senderName}! Skor kamu sekarang ${score.score}.` }, { quoted: parsed.message });
    }
  };
}

module.exports = { createGameService };
