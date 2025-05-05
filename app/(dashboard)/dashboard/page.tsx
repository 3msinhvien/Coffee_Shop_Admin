"use client"

import { useState, useEffect } from "react"
import { BarChart, Coffee, DollarSign, Package, ShoppingCart, TrendingDown, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table"
import { LowStockTable } from "@/components/dashboard/low-stock-table"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { TopProductsChart } from "@/components/dashboard/top-products-chart"
import { fetchDashboardData, fetchOrders, fetchProducts, fetchUsers } from "@/lib/api"
import type { DashboardData, Order, Product, User } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Tải dữ liệu từ nhiều API cùng lúc
        const [dashboardResult, ordersResult, productsResult, usersResult] = await Promise.all([
          fetchDashboardData(),
          fetchOrders(),
          fetchProducts(),
          fetchUsers(),
        ])

        setDashboardData(dashboardResult)
        setOrders(ordersResult)
        setProducts(productsResult)
        setUsers(usersResult)
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err)
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Tính toán các số liệu tổng quan nếu không có sẵn từ API dashboard
  const calculateMetrics = () => {
    if (dashboardData) return dashboardData

    // Tính toán các số liệu từ dữ liệu có sẵn nếu không có API dashboard
    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = Number.parseFloat(order.totalPrice || "0")
      return sum + orderTotal
    }, 0)

    const pendingOrders = orders.filter(
      (order) => order.delivery_status === "pending" || order.payment?.status === "unpaid",
    ).length

    const lowStockItems = products.filter(
      (product) => product.quantity < 10, // Giả sử sản phẩm có số lượng < 10 là sắp hết hàng
    )

    const newCustomers = users.filter((user) => {
      // Giả sử người dùng được tạo trong 30 ngày qua là khách hàng mới
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return new Date(user.created_at || Date.now()) > thirtyDaysAgo
    }).length

    // Tạo dữ liệu mẫu cho biểu đồ doanh thu
    const salesData = generateSampleSalesData()

    // Tạo dữ liệu mẫu cho biểu đồ sản phẩm bán chạy
    const topProducts = products.slice(0, 5).map((product) => ({
      name: product.name,
      value: product.quantity_sale || Math.floor(Math.random() * 50) + 10,
    }))

    return {
      totalRevenue,
      revenueChange: 5.2, // Giả định
      totalOrders: orders.length,
      pendingOrders,
      totalProducts: products.length,
      lowStockProducts: lowStockItems.length,
      totalCustomers: users.length,
      newCustomers,
      salesData,
      topProducts,
      recentOrders: orders.slice(0, 5),
      lowStockItems,
    }
  }

  // Tạo dữ liệu mẫu cho biểu đồ doanh thu
  const generateSampleSalesData = () => {
    const data = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const day = date.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric" })
      const amount = Math.floor(Math.random() * 500) + 100

      data.push({ date: day, amount })
    }

    return data
  }

  const metrics = calculateMetrics()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
          <p className="text-muted-foreground">Tổng quan về cửa hàng cà phê của bạn</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-1" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
          <p className="text-muted-foreground">Tổng quan về cửa hàng cà phê của bạn</p>
        </div>

        <Alert variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
        <p className="text-muted-foreground">Tổng quan về cửa hàng cà phê của bạn</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRevenue?.toLocaleString("vi-VN")} đ</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {metrics.revenueChange > 0 ? (
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={metrics.revenueChange > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(metrics.revenueChange || 0)}% so với tháng trước
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{metrics.pendingOrders} đơn hàng đang chờ xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">{metrics.lowStockProducts} sản phẩm sắp hết hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">{metrics.newCustomers} khách hàng mới trong tháng</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Doanh thu theo ngày</CardTitle>
                <CardDescription>Doanh thu hàng ngày trong 7 ngày qua</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart data={metrics.salesData || []} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Sản phẩm bán chạy</CardTitle>
                <CardDescription>Các sản phẩm bán chạy nhất trong tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <TopProductsChart data={metrics.topProducts || []} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
                <CardDescription>Các đơn hàng mới nhất từ khách hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentOrdersTable data={metrics.recentOrders || []} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Sản phẩm sắp hết hàng</CardTitle>
                <CardDescription>Các sản phẩm cần nhập thêm</CardDescription>
              </CardHeader>
              <CardContent>
                <LowStockTable data={metrics.lowStockItems || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích nâng cao</CardTitle>
              <CardDescription>Các chỉ số chi tiết và xu hướng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center border rounded-md">
                <div className="flex flex-col items-center text-center">
                  <BarChart className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">Mô-đun phân tích</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Phân tích chi tiết sẽ được hiển thị ở đây. Phần này có thể được mở rộng với nhiều biểu đồ và chỉ số
                    hơn.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo</CardTitle>
              <CardDescription>Tạo và tải xuống báo cáo kinh doanh</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center border rounded-md">
                <div className="flex flex-col items-center text-center">
                  <Coffee className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">Mô-đun báo cáo</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Tạo báo cáo về doanh thu, tồn kho và khách hàng. Các tùy chọn xuất báo cáo sẽ có sẵn tại đây.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
