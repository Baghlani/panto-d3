import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import { server } from "./mocks/server";

expect.extend(matchers);

afterEach(() => {
  server.resetHandlers();
  cleanup();
});
