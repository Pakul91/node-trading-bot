// import axios, { AxiosResponse } from "axios";
// import OandaApi from "../src/OandaAPI";

// // Mock axios to return a fake response
// jest.mock("axios");

// describe("fetchCandles", () => {
//   //   const OandaAPI;

//   test("should return [status, data] when called with valid parameters", async () => {
//     // Arrange
//     const pairName = "BTC-USD";
//     const granularity = "1H";
//     const count = 10;
//     const from = "2022-01-01T00:00:00Z";
//     const to = "2022-01-02T00:00:00Z";
//     const expectedResponse = [200, { candles: [] }];

//     // Create a mock implementation of axios.get()
//     (axios.get as jest.MockedFunction<typeof axios.get>).mockImplementationOnce(
//       async (url: string, options?: any): Promise<AxiosResponse> => {
//         // Return a fake response that matches the expected response format
//         return {
//           status: expectedResponse[0],
//           data: expectedResponse[1],
//           statusText: "OK",
//           headers: {},
//           config: {},
//         };
//       }
//     );

//     // Act
//     const response = await yourClassInstance.fetchCandles(
//       pairName,
//       granularity,
//       count,
//       from,
//       to
//     );

//     // Assert
//     expect(response).toEqual(expectedResponse);
//   });
// });
