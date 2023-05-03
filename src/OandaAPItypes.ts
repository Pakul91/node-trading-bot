export type ApiInstrumentsResponse = {
  instruments: ApiInstrumentData[];
};

export type ApiInstrumentData = {
  name: string;
  type: string;
  displayName: string;
  pipLocation: number;
  displayPrecision: number;
  tradeUnitsPrecision: number;
  minimumTradeSize: string;
  maximumTrailingStopDistance: string;
  minimumTrailingStopDistance: string;
  maximumPositionSize: string;
  maximumOrderUnits: string;
  marginRate: string;
  guaranteedStopLossOrderMode: string;
  minimumGuaranteedStopLossDistance: string;
  guaranteedStopLossOrderExecutionPremium: string;
  guaranteedStopLossOrderLevelRestriction: object;
  tags: object[];
  financing: object;
};

export type InstrumentData = {
  name: string;
  type: string;
  displayName: string;
  pipLocation: number;
  marginRate: number;
};

export type ApiCandleData = {
  instrument: string;
  granularity: string;
  candles: Candle[];
};

export type Candle = {
  complete: boolean;
  volume: number;
  time: string;
  bid: Prices;
  mid: Prices;
  ask: Prices;
};

type Prices = {
  o: string;
  h: string;
  l: string;
  c: string;
};
