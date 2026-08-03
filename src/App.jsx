import { useEffect, useMemo, useState } from "react";

const currencies = [
  { code: "BRL", name: "Real Brasileiro", flag: "🇧🇷" },
  { code: "USD", name: "Dólar Americano", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "Libra Esterlina", flag: "🇬🇧" },
  { code: "JPY", name: "Iene Japonês", flag: "🇯🇵" },
  { code: "CAD", name: "Dólar Canadense", flag: "🇨🇦" },
];

export default function App() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [rate, setRate] = useState(null);
  const [convertedValue, setConvertedValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = currencies.find((currency) => currency.code === fromCurrency);
  const to = currencies.find((currency) => currency.code === toCurrency);

  const formattedAmount = useMemo(() => Number(amount || 0), [amount]);

  function formatCurrency(value, currencyCode) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currencyCode,
    }).format(value || 0);
  }

  function handleInvertCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  useEffect(() => {
    async function convertCurrency() {
      const numericAmount = Number(amount);

      if (!amount || numericAmount <= 0) {
        setConvertedValue(0);
        setRate(null);
        setError("");
        return;
      }

      if (fromCurrency === toCurrency) {
        setConvertedValue(numericAmount);
        setRate(1);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const url = `https://api.frankfurter.dev/v2/rate/${fromCurrency}/${toCurrency}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Não foi possível buscar a cotação.");
        }

        const data = await response.json();

        if (!data.rate) {
          throw new Error("Cotação não encontrada para essa moeda.");
        }

        const currentRate = Number(data.rate);

        setRate(currentRate);
        setConvertedValue(numericAmount * currentRate);
      } catch (error) {
        setError(error.message || "Erro ao carregar a cotação.");
        setConvertedValue(null);
        setRate(null);
      } finally {
        setLoading(false);
      }
    }

    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <main className="min-h-screen bg-[#08030f] px-6 py-10 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-md">
            <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200">
              Conversor de Moedas
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">
              Converta moedas com cotação atualizada
            </h1>

            <p className="mt-4 max-w-xl text-gray-400">
              Informe um valor, escolha as moedas e veja a conversão usando uma
              API real de câmbio.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Valor
                </label>

                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-lg text-white outline-none transition placeholder:text-gray-500 focus:border-violet-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">De</label>

                <select
                  value={fromCurrency}
                  onChange={(event) => setFromCurrency(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-violet-400/50"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleInvertCurrencies}
                className="rounded-full border border-violet-400/30 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
              >
                Inverter moedas
              </button>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Para
                </label>

                <select
                  value={toCurrency}
                  onChange={(event) => setToCurrency(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition focus:border-violet-400/50"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-md">
            <p className="text-sm font-medium text-violet-200">Resultado</p>

            {loading && (
              <p className="mt-6 text-gray-400">Carregando cotação...</p>
            )}

            {error && <p className="mt-6 text-red-300">{error}</p>}

            {!loading && !error && (
              <>
                <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-5xl">
                  {formatCurrency(convertedValue, toCurrency)}
                </h2>

                <p className="mt-5 text-gray-300">
                  {from?.flag} {formatCurrency(formattedAmount, fromCurrency)} ={" "}
                  {to?.flag} {formatCurrency(convertedValue, toCurrency)}
                </p>

                <div className="mt-8 rounded-3xl border border-violet-400/20 bg-violet-500/10 p-5">
                  <p className="text-sm text-violet-200">Cotação usada</p>

                  <p className="mt-2 text-lg font-semibold">
                    1 {fromCurrency} = {rate ? rate.toFixed(4) : "0.0000"}{" "}
                    {toCurrency}
                  </p>
                </div>
              </>
            )}

            <p className="mt-8 text-xs leading-relaxed text-gray-500">
              As cotações são buscadas pela API Frankfurter. Os valores podem
              variar conforme atualização do mercado.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}