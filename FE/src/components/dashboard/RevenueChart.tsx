import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { 
  PeriodType, 
  RevenueDataPoint, 
  formatRevenue, 
  fetchRevenueData,
  getRevenueDataFallback 
} from "@/lib/revenueData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRevenueHost } from "@/hooks/useAnalyse";
import { toast } from "sonner";

interface RevenueChartProps {
  className?: string;
  _idHost: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ className, _idHost }) => {
  const [periodType, setPeriodType] = useState<PeriodType>("day");
  const [periodCount, setPeriodCount] = useState<number>(7);
  const [revenueData, setRevenueData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {revenue, getRevenueHost} = useGetRevenueHost()
  
  // Fetch revenue data when period type or count changes
  useEffect(() => {
    const loadRevenueData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getRevenueHost({periodType, count: periodCount, hostId: _idHost});
        setRevenueData(data.data.data);
      } catch (err) {
        console.error("Failed to fetch revenue data:", err);
        setError("Không thể tải dữ liệu doanh thu. Đang hiển thị dữ liệu mẫu.");
        toast.error("Không thể tải dữ liệu doanh thu. Đang hiển thị dữ liệu mẫu.");
        // Use fallback data
        setRevenueData(getRevenueDataFallback(periodType, periodCount));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRevenueData();
  }, [periodType, periodCount,_idHost]);
  
  // Period options
  const periodOptions = [
    { value: "day", label: "Ngày" },
    { value: "month", label: "Tháng" },
    { value: "year", label: "Năm" },
  ];
  
  // Count options based on period type
  const countOptions = {
    day: [
      { value: 7, label: "7 ngày" },
      { value: 14, label: "14 ngày" },
      { value: 30, label: "30 ngày" },
      { value: 60, label: "60 ngày" },
    ],
    month: [
      { value: 3, label: "3 tháng" },
      { value: 6, label: "6 tháng" },
      { value: 12, label: "12 tháng" },
      { value: 24, label: "24 tháng" },
    ],
    year: [
      { value: 3, label: "3 năm" },
      { value: 5, label: "5 năm" },
      { value: 10, label: "10 năm" },
    ],
  };
  
  // Function to get title based on period type
  const getChartTitle = () => {
    switch (periodType) {
      case "day":
        return `Doanh thu theo ngày (${periodCount} ngày gần đây)`;
      case "month":
        return `Doanh thu theo tháng (${periodCount} tháng gần đây)`;
      case "year":
        return `Doanh thu theo năm (${periodCount} năm gần đây)`;
      default:
        return "Doanh thu";
    }
  };
  
  // Format tooltip value
  const formatTooltipValue = (value: number) => {
    return formatRevenue(value);
  };

  return (
    <Card className={cn("mb-8", className)}>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>{getChartTitle()}</CardTitle>
            <CardDescription>
              Biểu đồ doanh thu trong khoảng thời gian được chọn
              {error && <span className="text-red-500 block mt-1">{error}</span>}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select 
              value={periodType} 
              onValueChange={(value) => {
                setPeriodType(value as PeriodType);
                setPeriodCount(value === "day" ? 7 : value === "month" ? 12 : 5);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={periodCount.toString()} 
              onValueChange={(value) => setPeriodCount(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Số lượng" />
              </SelectTrigger>
              <SelectContent>
                {countOptions[periodType].map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full mt-4 mb-8">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-full w-full rounded-md" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer 
                config={{
                  revenue: {
                    label: "Doanh thu",
                    theme: {
                      light: "#4f46e5",
                      dark: "#818cf8",
                    },
                  },
                }}
              >
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tickMargin={10}
                  />
                  <YAxis 
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`;
                      } else if (value >= 1000) {
                        return `${(value / 1000).toFixed(0)}K`;
                      }
                      return `${value}`;
                    }} 
                  />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value: number) => [formatTooltipValue(value), "Doanh thu"]}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ChartContainer>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;