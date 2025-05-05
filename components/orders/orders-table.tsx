"use client"

import { useState } from "react"
import { Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import type { Order } from "@/types"

interface OrdersTableProps {
  orders: Order[]
  onUpdateStatus: (id: number, data: { payment_status?: string; delivery_status?: string }) => void
}

export function OrdersTable({ orders, onUpdateStatus }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
  }

  const handlePaymentStatusChange = (id: number, status: string) => {
    onUpdateStatus(id, { payment_status: status })
  }

  const handleDeliveryStatusChange = (id: number, status: string) => {
    onUpdateStatus(id, { delivery_status: status })
  }

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.delivery?.name || order.user?.username}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.payment?.status || "unpaid"} />
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.delivery_status || "pending"} />
                  </TableCell>
                  <TableCell className="text-right">${Number.parseFloat(order.totalPrice).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Payment Status</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup
                              value={order.payment?.status || "unpaid"}
                              onValueChange={(value) => handlePaymentStatusChange(order.id, value)}
                            >
                              <DropdownMenuRadioItem value="unpaid">Unpaid</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="paid">Paid</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Delivery Status</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup
                              value={order.delivery_status || "pending"}
                              onValueChange={(value) => handleDeliveryStatusChange(order.id, value)}
                            >
                              <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="shipped">Shipped</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="delivered">Delivered</DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OrderDetailsDialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder}
      />
    </>
  )
}
