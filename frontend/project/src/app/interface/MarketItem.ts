export interface MarketItem {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  high24h: number;
  low24h: number;
  type: 'CRYPTO' | 'STOCK' | 'FOREX' | 'COMMODITY';
}
