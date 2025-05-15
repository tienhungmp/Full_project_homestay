import { format, subDays, subMonths, subYears, eachDayOfInterval, eachMonthOfInterval, eachYearOfInterval } from 'date-fns';
import axios from 'axios';
import { useGetRevenueHost } from '@/hooks/useAnalyse';

// Types for revenue data
export type RevenueDataPoint = {
  name: string;
  revenue: number;
  date?: Date; // Internal use for sorting
};

export type PeriodType = 'day' | 'month' | 'year';


// Function to fetch revenue data from API
export const fetchRevenueData = async (periodType: PeriodType, count: number): Promise<RevenueDataPoint[]> => {
  try {
    const response = await axios.get(`http://localhost:5000/analytics/revenue`, {
      params: { periodType, count },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Transform API data to match our format
    return response.data.data.map((item: any) => ({
      name: formatDateByPeriodType(new Date(item.date), periodType),
      revenue: item.revenue,
      date: new Date(item.date)
    }));
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    // Return empty array or fallback to mock data in case of error
    return getRevenueDataFallback(periodType, count);
  }
};

// Helper function to format date based on period type
const formatDateByPeriodType = (date: Date, periodType: PeriodType): string => {
  switch (periodType) {
    case 'day':
      return format(date, 'dd/MM');
    case 'month':
      return format(date, 'MM/yyyy');
    case 'year':
      return format(date, 'yyyy');
    default:
      return format(date, 'dd/MM/yyyy');
  }
};

// Function to generate random revenue data (fallback)
const generateRandomRevenue = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate daily revenue data for the last n days (fallback)
export const generateDailyRevenueData = (days: number = 30): RevenueDataPoint[] => {
  const today = new Date();
  const interval = eachDayOfInterval({
    start: subDays(today, days - 1),
    end: today
  });

  return interval.map(date => ({
    name: format(date, 'dd/MM'),
    revenue: generateRandomRevenue(300000, 1500000),
    date
  }));
};

// Generate monthly revenue data for the last n months (fallback)
export const generateMonthlyRevenueData = (months: number = 12): RevenueDataPoint[] => {
  const today = new Date();
  const interval = eachMonthOfInterval({
    start: subMonths(today, months - 1),
    end: today
  });

  return interval.map(date => ({
    name: format(date, 'MM/yyyy'),
    revenue: generateRandomRevenue(1500000, 5000000),
    date
  }));
};

// Generate yearly revenue data for the last n years (fallback)
export const generateYearlyRevenueData = (years: number = 5): RevenueDataPoint[] => {
  const today = new Date();
  const interval = eachYearOfInterval({
    start: subYears(today, years - 1),
    end: today
  });

  return interval.map(date => ({
    name: format(date, 'yyyy'),
    revenue: generateRandomRevenue(18000000, 50000000),
    date
  }));
};

// Function to get fallback revenue data based on period type
export const getRevenueDataFallback = (periodType: PeriodType, count?: number): RevenueDataPoint[] => {
  switch (periodType) {
    case 'day':
      return generateDailyRevenueData(count || 30);
    case 'month':
      return generateMonthlyRevenueData(count || 12);
    case 'year':
      return generateYearlyRevenueData(count || 5);
    default:
      return generateMonthlyRevenueData(12);
  }
};

// Format revenue value for display
export const formatRevenue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M VND`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K VND`;
  }
  return `${value} VND`;
};