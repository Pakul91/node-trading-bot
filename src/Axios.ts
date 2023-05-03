import axios, { AxiosInstance, AxiosResponse } from "axios";
import dotenv from "dotenv";
dotenv.config();

export default class Axios {
  // Create a new axios instance with the base url and the authorization header
  static axios: AxiosInstance = axios.create({
    baseURL: process.env.OANDA_URL,
    headers: {
      Authorization: `Bearer ${process.env.OANDA_TOKEN}`,
    },
  });

  //   Get request
  static async get(endpoint: string, params: object = null): Promise<any> {
    try {
      const response: AxiosResponse = await this.axios.get(endpoint, {
        params,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
