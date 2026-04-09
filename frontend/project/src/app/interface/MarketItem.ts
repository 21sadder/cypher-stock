export interface MarketItem {
  symbol: string;
  price: number;
  changePercent: number;
  volume: number;
  type: 'CRYPTO' | 'STOCK' | 'FOREX' | 'COMMODITY';
}
