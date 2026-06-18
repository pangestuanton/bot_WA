async function convertCurrency({ amount, from, to }) {
  const normalizedFrom = from.toUpperCase();
  const normalizedTo = to.toUpperCase();

  const response = await fetch(`https://open.er-api.com/v6/latest/${normalizedFrom}`);
  if (!response.ok) {
    throw new Error('Gagal mengambil data kurs.');
  }

  const data = await response.json();
  const rate = data?.rates?.[normalizedTo];
  if (!rate) {
    throw new Error('Mata uang tidak ditemukan.');
  }

  return {
    from: normalizedFrom,
    to: normalizedTo,
    amount,
    result: amount * rate,
    rate
  };
}

module.exports = { convertCurrency };
