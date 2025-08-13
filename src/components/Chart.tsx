import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import type { ChartDefinition } from "../types";

// Color palette for multi-series (dynamic)
const colors = ["blue", "green", "red", "orange", "purple", "brown", "pink", "gray", "cyan", "magenta"];
const getColor = (index: number) => colors[index % colors.length] ?? "steelblue";

// Chart component
const Chart = ({ title, data }: ChartDefinition) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Validate timestamps
    for (const [timestamp] of data) {
      if (typeof timestamp !== "number" || isNaN(timestamp)) {
        setError("Invalid timestamp in data");
        return;
      }
    }

    // Detect chart type
    const firstValue = data[0][1];
    const isMulti = Array.isArray(firstValue);
    const numSeries = isMulti ? (firstValue as number[]).length : 1;

    // Prepare data for D3
    const width = 720;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    svg.selectAll("*").remove(); // Clear previous

    // Scales
    const xDomain = d3.extent(data, d => d[0]) as [number, number];
    const x = d3
      .scaleLinear()
      .domain(xDomain)
      .range([margin.left, width - margin.right]);

    let yDomain: [number, number] = [0, 0];
    if (isMulti) {
      const allValues = data.flatMap(d => ((d[1] as number[]) ?? []).filter(v => v !== null));
      yDomain = d3.extent(allValues) as [number, number];
    } else {
      const values = data.map(d => d[1] as number).filter(v => v !== null);
      yDomain = d3.extent(values) as [number, number];
    }
    const y = d3
      .scaleLinear()
      .domain(yDomain)
      .range([height - margin.bottom, margin.top]);

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(d3.axisLeft(y));

    // Line generator
    const line = d3
      .line<[number, number | null]>()
      .x(d => x(d[0]))
      .y(d => y(d[1] as number))
      .defined(d => d[1] !== null);

    if (isMulti) {
      for (let i = 0; i < numSeries; i++) {
        const seriesData = data.map(d => {
          const value = (d[1] as number[])[i];
          return [d[0], value !== undefined ? value : null] as [number, number | null];
        });

        svg
          .append("path")
          .datum(seriesData)
          .attr("fill", "none")
          .attr("stroke", getColor(i))
          .attr("stroke-width", 1.5)
          .attr("d", line)
          .attr("aria-label", `Line chart for series ${i + 1}`);
      }
    } else {
      const singleData = data.map(d => [d[0], (d[1] as number) ?? null] as [number, number | null]);
      svg
        .append("path")
        .datum(singleData)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .attr("aria-label", "Line Chart");
    }
  }, [data]);

  return (
    <div>
      <h3>{title}</h3>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <svg ref={svgRef} role="presentation"></svg>
          {data.length > 0 && Array.isArray(data[0][1]) && (
            <div className="multi-series-legend">
              {Array.from({ length: (data[0][1] as number[]).length }).map((_, i) => (
                <span key={i} className="multi-series-legend-item">
                  <span
                    className="multi-series-legend-item-dot"
                    style={{ backgroundColor: getColor(i) }}
                  ></span>
                  Series {i + 1}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Chart;
