import { useEffect, useState } from "react";
import "./App.css";
import Chart from "./components/Chart";
import type { ChartDefinition } from "./types";

function App() {
  const [charts, setCharts] = useState<ChartDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json", { signal: controller.signal });
        if (!response.ok) throw new Error(`Failed to fetch data.json: ${response.status}`);

        const raw = await response.json();
        if (!Array.isArray(raw)) throw new Error("data.json must contain an array of chart definitions");

        // Minimal validation and normalization
        const normalized: ChartDefinition[] = raw.map((chart, index) => {
          if (!chart || typeof chart !== "object") throw new Error(`Invalid chart at index ${index}`);
          if (!Array.isArray(chart.data)) throw new Error(`Invalid data at chart with index ${index}`);

          const title = typeof chart.title === "string" ? chart.title : `Chart ${index + 1}`;
          const data = chart.data as ChartDefinition["data"];
          return { title, data };
        });

        setCharts(normalized);
      } catch (e: unknown) {
        if (e instanceof Error) {
          if (e.name !== "AbortError") setError(e.message);
        } else setError("Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div>
      {charts.map(chart => (
        <Chart key={chart.title} title={chart.title} data={chart.data} />
      ))}
    </div>
  );
}

export default App;
