// Moedas e suas bandeiras
const currencies = [
  { code: "USD", name: "Dólar Americano", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "BRL", name: "Real Brasileiro", symbol: "R$", flag: "🇧🇷" },
  { code: "GBP", name: "Libra Esterlina", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Iene Japonês", symbol: "¥", flag: "🇯🇵" },
  { code: "CAD", name: "Dólar Canadense", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Dólar Australiano", symbol: "A$", flag: "🇦🇺" },
  { code: "CHF", name: "Franco Suíço", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Yuan Chinês", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Rúpia Indiana", symbol: "₹", flag: "🇮🇳" },
  { code: "MXN", name: "Peso Mexicano", symbol: "$", flag: "🇲🇽" },
  { code: "ARS", name: "Peso Argentino", symbol: "$", flag: "🇦🇷" }
];

const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");

// Popular selects com bandeiras
currencies.forEach(c => {
  const label = `${c.flag} ${c.code} — ${c.name}`;

  fromSelect.add(new Option(label, c.code));
  toSelect.add(new Option(label, c.code));
});

fromSelect.value = "USD";
toSelect.value = "BRL";

// API real
async function convert() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = fromSelect.value;
  const to = toSelect.value;

  try {
    // Busca dados em tempo real
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await res.json();

    if (data.result !== "success") {
      alert("Erro ao buscar taxas. Tente novamente.");
      return;
    }

    const rate = data.rates[to];
    if (!rate) {
      alert("Conversão indisponível.");
      return;
    }

    // Calcular
    const result = amount * rate;

    const symbolFrom = currencies.find(c => c.code === from).symbol;
    const symbolTo = currencies.find(c => c.code === to).symbol;

    document.getElementById("baseValue").innerText =
      `${symbolFrom} ${amount.toFixed(2)} =`;

    document.getElementById("finalValue").innerText =
      `${symbolTo} ${result.toFixed(2)}`;

    document.getElementById("rate").innerText =
      `1 ${from} = ${rate.toFixed(4)} ${to}`;

    document.getElementById("time").innerText =
      `Atualizado: ${new Date(data.time_last_update_utc).toLocaleString()}`;

  } catch (error) {
    alert("Falha ao conectar com a API.");
  }
}

// Inverter moedas
function swap() {
  [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
  convert();
}

convert();
