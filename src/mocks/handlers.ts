import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/data.json", () => {
    return HttpResponse.json([
      {
        title: "Mock Single Series",
        data: [
          [0, 5],
          [10, null],
          [20, 15],
        ],
      },
      {
        title: "Mock Multi Series",
        data: [
          [0, [1, 2, 3]],
          [10, [null, 5, 6]],
          [20, [7, null, 9]],
        ],
      },
      {
        title: "Invalid Timestamp",
        data: [
          [NaN, 10],
          [10, 20],
        ],
      },
    ]);
  }),
];
