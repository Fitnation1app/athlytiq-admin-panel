"use client"
import { use, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersIcon, WalletIcon, UserPlusIcon, UserXIcon } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import  useAuthGuard  from "@/hooks/useAuthGuard"



export default function DashboardPage() {

    const isChecking = useAuthGuard();
    


    const [metrics, setMetrics] = useState<any>(null)
    const [metricsView, setMetricsView] = useState("daily")



    const formatChange = (metric: any) => {
      if (!metric) return "-";
      if (typeof metric.change === "string") return "New";

      const value = metric.change;

      if (value >= 1000) return "🚀 Exploding growth";
      if (value >= 500) return "🔥 Massive increase";
      if (value >= 100) return `📈 +${value}% ${metric.label}`;
      if (value <= -100) return `📉 ${value}% ${metric.label}`;

      return `${value > 0 ? "+" : ""}${value}% ${metric.label}`;
    };

    useEffect(() => {
        fetch(`http://localhost:8000/dashboard_stats/dashboard-metrics?view=${metricsView}`)
            .then(res => res.json())
            .then(setMetrics)
    }, [metricsView]);

    if (isChecking) return null;


  

    return (
     
        
         <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your platform statistics and performance.</p>
            </div>

            <Tabs value={metricsView} onValueChange={setMetricsView} className="space-y-4">

                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="daily" className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
                                <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.new_users?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.new_users)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.total_users?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.total_users)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Posts Today</CardTitle>
                                <WalletIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.posts?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.posts)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Restricted Users</CardTitle>
                                <UserXIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.restricted_users?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.restricted_users)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="weekly" className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">New Users This Week</CardTitle>
                                <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.new_users?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.new_users)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.total_users?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.total_users)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Posts This Week</CardTitle>
                                <WalletIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.posts?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.posts)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Restricted Users</CardTitle>
                                <UserXIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.restricted_users?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.restricted_users)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="monthly" className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">New Users This Month</CardTitle>
                                <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.new_users?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.new_users)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.total_users?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.total_users)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Posts This Month</CardTitle>
                                <WalletIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.posts?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.posts)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Restricted Users</CardTitle>
                                <UserXIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics?.restricted_users?.count ?? "-"}</div>
                                <p className="text-xs text-muted-foreground">
                                    {formatChange(metrics?.restricted_users)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Post Overview</CardTitle>
                        <CardDescription>Post volume over time</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <DashboardChart />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Posts</CardTitle>
                        <CardDescription>Latest Posts on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentTransactions />
                    </CardContent>
                </Card>
            </div>
        </div>
      
      
       
    );
  }

