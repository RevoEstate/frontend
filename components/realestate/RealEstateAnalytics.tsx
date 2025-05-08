"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Home, DollarSign, Users } from "lucide-react";

const chartConfig = {
  listed: {
    label: "Properties Listed",
    color: "#3b82f6",
  },
  sold: {
    label: "Properties Sold",
    color: "#10b981",
  },
  rented: {
    label: "Properties Rented",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

interface Stats {
  totalProperties: number;
  totalPackagesPurchased: number;
  totalPackagePriceETB: number;
  totalScheduledCustomers: number;
}

interface MonthlyData {
  month: string;
  listed: number;
  sold: number;
  rented: number;
}

interface City {
  name: string;
  listed: number;
  value: number;
}

export function RealEstateAnalytics() {
  const [data, setData] = useState<{
    stats: Stats;
    monthlyData: MonthlyData[];
    cities: City[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/properties/companystatistics`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setData(response.data?.data);
          setLoading(false);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>{error || "No data available"}</div>;
  }

  const statsDisplay = [
    {
      title: "Total Properties",
      value: data.stats.totalProperties.toString(),
      change: "",
      icon: <Home className="h-6 w-6" />,
    },
    {
      title: "Total Packages Purchased",
      value: data.stats.totalPackagesPurchased.toString(),
      change: "",
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      title: "Total Package Price (ETB)",
      value: data.stats.totalPackagePriceETB.toLocaleString("en-US"),
      change: "",
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      title: "Total Scheduled Customers",
      value: data.stats.totalScheduledCustomers.toString(),
      change: "",
      icon: <Users className="h-6 w-6" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsDisplay.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="text-muted-foreground">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Listings vs Sales vs Rented Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Property Listings, Sales & Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis tickLine={false} axisLine={false} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="listed"
                    fill="var(--color-listed)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="sold"
                    fill="var(--color-sold)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="rented"
                    fill="var(--color-rented)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Cities */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Cities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.cities.map((city, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{city.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {city.listed} listed properties
                  </p>
                </div>
                <div className="font-medium">
                  ${(city.value / 1000000).toFixed(1)}M
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
