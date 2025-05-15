
export interface Property {
  _id: string;
  name: string;
  address: string;
  price: number;
  rating: number;
  images: string[];
  type: string;
}


export interface Review {
  id: number;
  property: string;
  guest: string;
  date: string;
  rating: number;
  content: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface RevenueDataPoint {
  name: string;
  revenue: number;
  date?: Date;
}

export type PeriodType = 'day' | 'month' | 'year';
