# Panto D3 Chart App

## Overview

This is a React application built with Vite and TypeScript that loads chart data from `public/data.json` and renders it using D3.js. The app automatically detects whether the chart is single-series or multi-series based on the data format, handles null values by skipping them in line rendering, and displays chart titles. For multi-series charts, it renders multiple lines with dynamic colors and includes a legend.

The project focuses on clean, modular, and maintainable code, with error handling for invalid data (e.g., timestamps). Testing is set up with Vitest and MSW for unit and integration tests.

## Features (Based on Task Requirements)

- **Data Loading**: Fetches and processes chart definitions from `data.json`.
- **Chart Type Detection**: Automatically determines single-series (value is number/null) or multi-series (value is array).
- **Single-Series Rendering**: A single blue line chart, skipping null values.
- **Multi-Series Rendering**: Multiple lines (dynamic number of series) with predefined colors (blue, green, red, etc.), skipping nulls per series, and a legend.
- **Error Handling**: Validates timestamps; displays errors for invalid data.
- **Dynamic Rendering**: Loops through all charts in the data and renders them using a reusable `Chart` component.
- **Testing**: Unit tests for component rendering, null handling, type detection, and errors using Vitest + MSW.
- **Dark Mode**: Supports dark mode via prefers-color-scheme in index.css, adjusting backgrounds, text, and chart styles for better accessibility.

## Installation

1. Clone the repository:

   ```
   git clone <repo-url>
   cd panto-d3
   ```

2. Install dependencies:

   ```
   npm install
   ```

   - Core: React, Vite, TypeScript, D3.js (with types).
   - Testing: Vitest, @vitest/ui, jsdom, @testing-library/react, @testing-library/jest-dom, MSW.

## Usage

1. Run the development server:

   ```
   npm run dev
   ```

   Open `http://localhost:5173` to view the app. It will fetch `public/data.json` and render the charts.

2. Build for production:

   ```
   npm run build
   ```

3. Preview the build:
   ```
   npm run preview
   ```

## Testing

Tests are configured with Vitest and MSW for mocking API requests.

- Run tests:

  ```
  npm test
  ```

- Run with UI:

  ```
  npm run test:ui
  ```

- Generate coverage report:
  ```
  npm run coverage
  ```

Tests cover:

- Rendering single/multi series charts with null handling.
- Legend display for multi-series.
- Error display for invalid timestamps.
- Handling empty data.

## Code Structure

- **src/App.tsx**: Main component that fetches data from `/data.json`, validates it, and dynamically renders `Chart` components.
- **src/components/Chart.tsx**: Reusable component for rendering D3 charts, detecting type, handling nulls, and displaying legends.
- **src/types.ts**: Type definitions for chart data.
- **src/App.css** and **src/index.css**: Styles for charts, errors, and themes (light/dark).
- **src/mocks/**: MSW setup for testing mocked data fetches.
- **src/setupTests.ts**: Vitest setup with matchers and MSW resets.
- **src/components/Chart.test.tsx**: Unit/integration tests for Chart.
- **vitest.config.ts**: Vitest configuration (extends vite.config.ts).

## Notes

- The app assumes `data.json` is in the format specified in the task (array of {title, data}).
- No specific styling or responsiveness is implemented beyond functionality, as per task.
- For large datasets, consider optimization (e.g., sampling) in future iterations.
- Project uses TypeScript for type safety and ESLint for code quality.

If you have questions or need extensions, feel free to contribute!
