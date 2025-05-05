"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrdersTable } from "@/components/orders/orders-table"
import { fetchOrders, updateOrderStatus } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/types"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [deliveryFilter, setDeliveryFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        const data = await fetchOrders()
        setOrders(data)
      } catch (error) {
        console.error("Failed to load orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [toast])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery.toLowerCase()) ||
      (order.delivery?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPaymentStatus = paymentFilter === "all" || order.payment?.status === paymentFilter
    const matchesDeliveryStatus = deliveryFilter === "all" || order.delivery_status === deliveryFilter

    return matchesSearch && matchesPaymentStatus && matchesDeliveryStatus
  })

  const handleUpdateStatus = async (id: number, data: { payment_status?: string; delivery_status?: string }) => {
    try {
      await updateOrderStatus(id, data)

      // Update the local state
      setOrders(
        orders.map((order) => {
          if (order.id === id) {
            const updatedOrder = { ...order }

            if (data.payment_status) {
              updatedOrder.payment = {
                ...updatedOrder.payment,
                status: data.payment_status,
              }
            }

            if (data.delivery_status) {
              updatedOrder.delivery_status = data.delivery_status
            }

            return updatedOrder
          }
          return order
        }),
      )

      const statusType = data.payment_status ? "payment" : "delivery"
      const statusValue = data.payment_status || data.delivery_status

      toast({
        title: "Status Updated",
        description: `Order #${id} ${statusType} status changed to ${statusValue}`,
      })
    } catch (error) {
      console.error(`Failed to update order status for ID ${id}:`, error)
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search orders..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Delivery Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Delivery</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery("")
            setPaymentFilter("all")
            setDeliveryFilter("all")
          }}
        >
          Reset Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <OrdersTable orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />
      )}
    </div>
  )
}
