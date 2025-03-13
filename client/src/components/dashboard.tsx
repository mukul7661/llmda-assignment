"use client";

import { useEvents } from "../lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Event } from "../lib/queries";

export function Dashboard() {
  const { data: events = [] } = useEvents();

  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) > new Date()
  ).length;
  const pastEvents = events.filter(
    (event) => new Date(event.date) <= new Date()
  ).length;

  const categories: Record<string, number> = events.reduce((acc, event) => {
    if (event.category) {
      acc[event.category] = (acc[event.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const statusData = [
    { name: "Upcoming", value: upcomingEvents, fill: "hsl(142.1 76.2% 36.3%)" },
    { name: "Past", value: pastEvents, fill: "hsl(346.8 77.2% 49.8%)" },
  ];

  const categoryData = Object.entries(categories).map(
    ([category, count], index) => ({
      name: category,
      value: count,
      fill: `hsl(${index * 50} 70% 50%)`,
    })
  );

  type ChartConfig = {
    value: { label: string };
    [key: string]: { label: string; color?: string; fill?: string };
  };

  const statusChartConfig: ChartConfig = {
    value: { label: "Events" },
    Upcoming: {
      label: "Upcoming",
      color: "hsl(142.1 76.2% 36.3%)",
      fill: "hsl(142.1 76.2% 36.3%)",
    },
    Past: {
      label: "Past",
      color: "hsl(346.8 77.2% 49.8%)",
      fill: "hsl(346.8 77.2% 49.8%)",
    },
  };

  const categoryChartConfig: ChartConfig = {
    value: { label: "Events" },
    ...Object.fromEntries(
      Object.keys(categories).map((category, index) => [
        category,
        {
          label: category,
          color: `hsl(${index * 20} 80% 40%)`,
          fill: `hsl(${index * 20} 80% 40%)`,
        },
      ])
    ),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalEvents}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={statusChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={categoryChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
