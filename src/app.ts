import fs from "fs";
import OandaAPI from "./OandaAPI.js";

const getCanldes = async (): Promise<any> => {
  try {
    await OandaAPI.getInstrumentBySymbol("EUR_USD");

    // const response = await OandaAPI.fetchCandles("EUR_USD", "H1", 10);
    // console.log(response);
  } catch (error) {
    console.error(error);
  }
};

getCanldes();
