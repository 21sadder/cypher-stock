export interface MarketItem {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  type: 'CRYPTO' | 'STOCK' | 'FOREX' | 'COMMODITY';
}
