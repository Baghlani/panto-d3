import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import App from "../App"; // Import App for integration test
import { server } from "../mocks/server";
import Chart from "./Chart";

// Start MSW server before tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("Chart Component", () => {
  it("renders single series chart correctly with null handling", async () => {
    // Mock single series data via MSW
    server.use(
      http.get("/data.json", () =>
        HttpResponse.json([
          {
            title: "Single",
            data: [
              [0, 5],
              [10, null],
              [20, 15],
            ],
          },
        ])
      )
    );

    render(<App />); // Render App which fetches and renders Chart

    // Wait for title to appear (after fetch)
    await waitFor(() => expect(screen.getByText("Single")).toBeInTheDocument());

    // Check that the line chart is rendered
    await waitFor(() => {
      const svg = screen.getByRole("presentation");
      expect(svg.querySelectorAll("[aria-label^='Line']")).toHaveLength(1);
    });
  });

  it("renders multi series chart with legend and null handling", () => {
    render(
      <Chart
        title="Multi"
        data={[
          [0, [1, 2]],
          [10, [3, null]],
        ]}
      />
    );

    expect(screen.getByText("Multi")).toBeInTheDocument();
    expect(screen.getAllByText(/Series \d/)).toHaveLength(2); // Legend items
  });

  it("shows error for invalid timestamp", () => {
    render(
      <Chart
        title="Invalid"
        data={[
          [NaN, 10],
          [10, 20],
        ]}
      />
    );

    expect(screen.getByText(/invalid timestamp/i)).toBeInTheDocument();
  });

  it("handles empty data without error", () => {
    render(<Chart title="Empty" data={[]} />);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
