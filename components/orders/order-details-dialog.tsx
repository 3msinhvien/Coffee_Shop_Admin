"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import type { Order } from "@/types"

interface OrderDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export function OrderDetailsDialog({ open, onOpenChange, order }: OrderDetailsDialogProps) {
  if (!order) return null

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order #{order.id} - {formatDate(order.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Payment Status</h3>
              <OrderStatusBadge status={order.payment?.status || "unpaid"} />
            </div>
            <div>
              <h3 className="text-sm font-medium">Delivery Status</h3>
              <OrderStatusBadge status={order.delivery_status || "pending"} />
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium">Total</h3>
              <p className="text-xl font-bold">${Number.parseFloat(order.totalPrice).toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-medium">Customer Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p>{order.delivery?.name || order.user?.username}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p>{order.user?.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p>{order.delivery?.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-medium">Shipping Address</h3>
            <p className="text-sm">{order.delivery?.address || "No address provided"}</p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-medium">Payment Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Method</p>
                <p className="capitalize">{order.payment?.method || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment ID</p>
                <p>{order.payment?.id || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 text-sm font-medium">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.carts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${Number.parseFloat(item.product.cost).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      ${(Number.parseFloat(item.product.cost) * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ${Number.parseFloat(order.totalPrice).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
