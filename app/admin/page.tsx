"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, ShoppingCart, DollarSign, Target, AlertCircle, CheckCircle } from "lucide-react"
import { db } from "../services/database"

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
  recentOrders: Array<{
    id: number
    date: string
    customer: string
    amount: number
    status: string
  }>
  salesTrend: Array<{
    date: string
    revenue: number
    orders: number
  }>
  categoryBreakdown: Array<{
    name: string
    value: number
    percentage: number
  }>
  lowStockItems: Array<{
    name: string
    stock: number
    threshold: number
  }>
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    topProducts: [],
    recentOrders: [],
    salesTrend: [],
    categoryBreakdown: [],
    lowStockItems: [],
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    try {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      const inventory = JSON.parse(localStorage.getItem("inventory") || "[]")
      const customers = JSON.parse(localStorage.getItem("customers") || "[]")

      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0)
      const totalOrders = orders.length
      const totalCustomers = customers.length
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      const productSales: Record<string, { name: string; sales: number; revenue: number }> = {}
      orders.forEach((order: any) => {
        order.items?.forEach((item: any) => {
          if (!productSales[item.name]) {
            productSales[item.name] = { name: item.name, sales: 0, revenue: 0 }
          }
          productSales[item.name].sales += item.quantity || 1
          productSales[item.name].revenue += item.total || 0
        })
      })

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      const categoryBreakdown: Record<string, number> = {}
      inventory.forEach((item: any) => {
        categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + item.stock * item.price
      })

      const totalCategoryValue = Object.values(categoryBreakdown).reduce((a: number, b: number) => a + b, 0)
      const categoryBreakdownData = Object.entries(categoryBreakdown).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: value as number,
        percentage: totalCategoryValue > 0 ? Math.round(((value as number) / totalCategoryValue) * 100) : 0,
      }))

      const recentOrders = orders
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map((order: any) => ({
          id: order.id,
          date: new Date(order.date).toLocaleDateString(),
          customer: order.customerName || "Unknown",
          amount: order.total || 0,
          status: "Completed",
        }))

      const salesTrend: Record<string, { revenue: number; orders: number }> = {}
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        salesTrend[dateStr] = { revenue: 0, orders: 0 }
      }

      orders.forEach((order: any) => {
        const dateStr = order.date?.split("T")[0] || new Date().toISOString().split("T")[0]
        if (salesTrend[dateStr]) {
          salesTrend[dateStr].revenue += order.total || 0
          salesTrend[dateStr].orders += 1
        }
      })

      const salesTrendData = Object.entries(salesTrend).map(([date, { revenue, orders }]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: Math.round(revenue),
        orders,
      }))

      const lowStockItems = inventory
        .filter((item: any) => item.stock <= item.lowStockThreshold)
        .map((item: any) => ({
          name: item.name,
          stock: item.stock,
          threshold: item.lowStockThreshold,
        }))
        .slice(0, 5)

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
        topProducts,
        recentOrders,
        salesTrend: salesTrendData,
        categoryBreakdown: categoryBreakdownData,
        lowStockItems,
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  const KPICard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
  }: {
    title: string
    value: string | number
    icon: any
    color: string
    trend?: string
  }) => (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`rounded-lg p-2.5 ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-blue-500"
          trend="↑ 12% from last month"
        />
        <KPICard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="bg-green-500"
          trend="↑ 8 orders this week"
        />
        <KPICard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="bg-purple-500"
          trend="↑ 5 new customers"
        />
        <KPICard
          title="Avg Order Value"
          value={`$${stats.averageOrderValue.toFixed(2)}`}
          icon={Target}
          color="bg-orange-500"
          trend="↑ 3% increase"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Revenue and orders over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Value distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Low Stock Items
            </CardTitle>
            <CardDescription>Items below minimum threshold</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.lowStockItems.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Stock: {item.stock} / Threshold: {item.threshold}</p>
                    </div>
                    <Badge variant="destructive">Low</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-sm text-muted-foreground">All items have sufficient stock</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium">Order ID</th>
                  <th className="text-left py-2 px-4 font-medium">Customer</th>
                  <th className="text-left py-2 px-4 font-medium">Date</th>
                  <th className="text-right py-2 px-4 font-medium">Amount</th>
                  <th className="text-center py-2 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4">#${order.id}</td>
                    <td className="py-2 px-4">{order.customer}</td>
                    <td className="py-2 px-4">{order.date}</td>
                    <td className="text-right py-2 px-4 font-medium">${order.amount.toFixed(2)}</td>
                    <td className="text-center py-2 px-4">
                      <Badge className="bg-green-500">{order.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
