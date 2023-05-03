import Axios from "./Axios.js";
import {
  ApiInstrumentsResponse,
  ApiInstrumentData,
  InstrumentData,
  ApiCandleData,
  Candle,
} from "./OandaAPItypes.js";
import FileHandler from "./utils/FileHandler.js";

import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

/**
 * A class to interact with Oanda API
 */
class OandaAPI {
  //  ---------------------- Fetching data ----------------------

  /**
   * Fetch all available instruments for the account
   * @returns
   */
  static async getAllInstruments(): Promise<void | Error> {
    try {
      // Fetch all instruments
      const data: ApiInstrumentsResponse = await Axios.get(
        `/accounts/${process.env.ACCOUNT_ID}/instruments`
      );

      const instruments: ApiInstrumentData[] = data.instruments;

      // If there are no instruments, return
      if (!instruments || instruments.length === 0) return;
      // Interate through the instruments
      instruments.forEach((instrument: ApiInstrumentData) => {
        // Process the instrument data
        const processedInstrument: InstrumentData =
          this.processInstrumentData(instrument);
        // Save the instrument data
        this.saveInstrumentData(processedInstrument);
      });
    } catch (error) {
      console.error(error);
    }
  }

  static async getInstrumentBySymbol(symbol: string): Promise<void> {
    // Save instrument symbol in params object
    const params = {
      instruments: symbol,
    };

    try {
      // Fetch instrument data
      const data: ApiInstrumentsResponse = await Axios.get(
        `/accounts/${process.env.ACCOUNT_ID}/instruments`,
        params
      );

      const instrument: ApiInstrumentData = data.instruments[0];
      // Process the instrument data
      const processedInstrument: InstrumentData =
        this.processInstrumentData(instrument);
      // Save the instrument data
      this.saveInstrumentData(processedInstrument);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // A function to fetch instrument data and convert it into a JavaScript object
  static processInstrumentData(
    instrumentData: ApiInstrumentData
  ): InstrumentData {
    return {
      name: instrumentData.name,
      type: instrumentData.type,
      displayName: instrumentData.displayName,
      pipLocation: instrumentData.pipLocation,
      marginRate: parseFloat(instrumentData.marginRate),
    };
  }

  static saveInstrumentData(instrumentData: InstrumentData): void {
    try {
      FileHandler.createFile(
        `${instrumentData.name}.json`,
        JSON.stringify(instrumentData),
        process.env.INSTRUMENTS_FOLDER_PATH
      );
    } catch (error) {}
  }

  static saveInstrumentCandles(
    pairName: string,
    granularity: string,
    candles: object[]
  ): void {
    const filePath: string = "./data/";
    const fileName: string = `${pairName}_${granularity}.json`;
    const candlesData: string = JSON.stringify(candles);
    try {
      fs.writeFile(`${filePath}${fileName}`, candlesData, (err) => {
        if (err) throw err;
      });
    } catch (error) {
      console.error(error);
    }
  }

  static processCanldesData(candlesData: ApiCandleData): any {
    const candles = candlesData.candles.map((candle: Candle) => {
      return {
        time: candle.time,
        bidOpen: parseFloat(candle.bid.o),
        bidHigh: parseFloat(candle.bid.h),
        bidLow: parseFloat(candle.bid.l),
        bidClose: parseFloat(candle.bid.c),
        midOpen: parseFloat(candle.mid.o),
        midHigh: parseFloat(candle.mid.h),
        midLow: parseFloat(candle.mid.l),
        midClose: parseFloat(candle.mid.c),
        askOpen: parseFloat(candle.ask.o),
        askHigh: parseFloat(candle.ask.h),
        askLow: parseFloat(candle.ask.l),
        askClose: parseFloat(candle.ask.c),
        volume: candle.volume,
      };
    });

    return candles;
  }

  /**
   *
   */
  static async fetchCandles(
    pairName: string,
    granularity: string,
    count?: number,
    from?: string,
    to?: string
  ): Promise<[number, any] | null> {
    try {
      // Check if the required parameters are provided
      if (!pairName || !granularity)
        throw new Error("pairName and granularity are required parameters");
      if (!count && !from && !to)
        throw new Error(
          "you need to provide eiter 'count' or 'from' and 'to' parameters"
        );

      const params = {
        pairName,
        granularity,
        price: "MBA",
      };
      // If count is provided, add it to the params object
      if (count) {
        params["count"] = count;
      }
      // Esle if from and to are provided
      else if (from && to) {
        // check if date format is correct (dd/mm/yyyy or dd-mm-yyyy or dd.mm.yyyy)
        const dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/;
        // If the date format is not correct, throw an error
        if (!dateReg.test(from) || !dateReg.test(to)) {
          throw new Error("date format is not correct");
        }
        // If the date format is correct, convert it to a Date object and add it to the params object
        params["from"] = new Date(from);
        params["to"] = new Date(to);
      }
      // Else if only one of from and to is provided, throw an error
      else if ((from && !to) || (!from && to)) {
        throw new Error("you need to provide both 'from' and 'to' parameters");
      }

      // Fetch candles data
      const response = await Axios.get(
        `/instruments/${pairName}/candles`,
        params
      );

      return [response.status, response.data];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default OandaAPI;
