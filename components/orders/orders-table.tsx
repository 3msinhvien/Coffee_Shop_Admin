"use client"

import { useState } from "react"
import { Eye, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
import type { Order } from "@/types"

interface OrdersTableProps {
  orders: Order[]
  onUpdateStatus: (id: string, status: string) => void
}

export function OrdersTable({ orders, onUpdateStatus }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleStatusChange = (id: string, status: string) => {
    onUpdateStatus(id, status)
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
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
                        <DropdownMenuRadioGroup
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="processing">Processing</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
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

function OrderStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { variant: "outline" },
    processing: { variant: "secondary" },
    completed: { variant: "default" },
    cancelled: { variant: "destructive" },
  }

  const config = statusMap[status] || { variant: "outline" }

  return <Badge variant={config.variant}>{status}</Badge>
}
