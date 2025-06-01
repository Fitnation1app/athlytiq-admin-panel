"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function DashboardChart() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<any[]>([])


  useEffect(() => {
    setMounted(true)
    fetch("http://localhost:8000/dashboard_stats/post-overview")
      .then(res => res.json())
      .then(res => {
        setData(
          (res.post_overview || []).map((item: any) => ({
            name: item.month,
            total: item.post_count,
          }))
        )
      })
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[350px] w-full bg-muted/20 rounded-md">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  return (
    <div className="h-[350px] w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R${value}`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip
            formatter={(value) => [`R${value}`, "Amount"]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar dataKey="total" fill="#80ced6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

